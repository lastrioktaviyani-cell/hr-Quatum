import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const statusEnum = z.enum(["MENUNGGU", "DISETUJUI", "DITOLAK", "DIBATALKAN"]);

const updateSchema = z.object({
  status: statusEnum,
  rejectReason: z.string().max(2000).optional().nullable(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    const { id } = await params;
    const body = await req.json();
    const parsed = updateSchema.parse(body);

    if (parsed.status === "DITOLAK" && !parsed.rejectReason?.trim()) {
      return NextResponse.json(
        { success: false, error: "Alasan penolakan wajib diisi" },
        { status: 400 },
      );
    }

    const existing = await getDb().leaveRequest.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Pengajuan cuti tidak ditemukan" },
        { status: 404 },
      );
    }

    const updated = await getDb().leaveRequest.update({
      where: { id },
      data: {
        status: parsed.status,
        rejectReason: parsed.status === "DITOLAK" ? parsed.rejectReason?.trim() : null,
        approverId: session?.user?.id || null,
        approvedAt: new Date(),
      },
    });

    // Invalidate the leave list cache (shared globalThis across handlers).
    (globalThis as { __leaveCache?: unknown }).__leaveCache = undefined;

    return NextResponse.json({ success: true, data: updated });
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
