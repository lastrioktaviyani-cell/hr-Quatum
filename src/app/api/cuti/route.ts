import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const leaveTypeEnum = z.enum([
  "CUTI_TAHUNAN",
  "CUTI_SAKIT",
  "IZIN",
  "CUTI_MELAHIRKAN",
  "CUTI_KHUSUS",
]);

const createLeaveSchema = z
  .object({
    employeeId: z.string().uuid("employeeId tidak valid"),
    type: leaveTypeEnum,
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal YYYY-MM-DD"),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal YYYY-MM-DD"),
    reason: z.string().min(3, "Alasan minimal 3 karakter").max(2000),
    documentUrl: z.string().url().optional().nullable(),
  })
  .refine((value) => value.startDate <= value.endDate, {
    message: "Tanggal mulai harus sebelum atau sama dengan tanggal selesai",
    path: ["endDate"],
  });

function calculateDays(startDate: string, endDate: string): number {
  const start = new Date(`${startDate}T00:00:00Z`).getTime();
  const end = new Date(`${endDate}T00:00:00Z`).getTime();
  return Math.floor((end - start) / 86_400_000) + 1;
}

export async function GET() {
  try {
    const leaveRequests = await getDb().leaveRequest.findMany({
      include: {
        employee: {
          select: {
            id: true,
            employeeNumber: true,
            fullName: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: leaveRequests });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const body = await req.json();
    const parsed = createLeaveSchema.parse(body);

    const employee = await getDb().employee.findUnique({
      where: { id: parsed.employeeId },
      select: { id: true, deletedAt: true },
    });
    if (!employee || employee.deletedAt) {
      return NextResponse.json(
        { success: false, error: "Karyawan tidak ditemukan" },
        { status: 404 },
      );
    }

    const overlapping = await getDb().leaveRequest.findFirst({
      where: {
        employeeId: parsed.employeeId,
        status: { in: ["MENUNGGU", "DISETUJUI"] },
        AND: [
          { startDate: { lte: new Date(`${parsed.endDate}T00:00:00Z`) } },
          { endDate: { gte: new Date(`${parsed.startDate}T00:00:00Z`) } },
        ],
      },
    });
    if (overlapping) {
      return NextResponse.json(
        {
          success: false,
          error: "Sudah ada pengajuan cuti yang overlap di rentang tanggal tersebut",
        },
        { status: 409 },
      );
    }

    const created = await getDb().leaveRequest.create({
      data: {
        employeeId: parsed.employeeId,
        type: parsed.type,
        startDate: new Date(`${parsed.startDate}T00:00:00Z`),
        endDate: new Date(`${parsed.endDate}T00:00:00Z`),
        durationDays: calculateDays(parsed.startDate, parsed.endDate),
        reason: parsed.reason.trim(),
        documentUrl: parsed.documentUrl ?? null,
        status: "MENUNGGU",
      },
      include: {
        employee: { select: { id: true, employeeNumber: true, fullName: true } },
      },
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validasi gagal", details: error.issues },
        { status: 400 },
      );
    }
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
