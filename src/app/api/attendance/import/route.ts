import { NextResponse } from "next/server";
import type { ImportApiRequest, ImportApiResponse } from "@/lib/attendance-types";

export async function POST(request: Request) {
  const body = (await request.json()) as ImportApiRequest;

  const validRows = body.rows.filter((row) => row.isValid);
  const uniqueRows = new Map(validRows.map((row) => [row.sourceHash, row]));
  const imported = uniqueRows.size;
  const skipped = validRows.length - imported;

  // TODO: when database is connected, replace this mock response with Prisma insert:
  // await prisma.attendanceRawLog.createMany({
  //   data: [...uniqueRows.values()].map((row) => ({
  //     employeePin: row.pin,
  //     scanAt: row.scanAt,
  //     scanType: row.scanType,
  //     deviceCode: row.deviceCode,
  //     source: "FILE_IMPORT",
  //     sourceHash: row.sourceHash,
  //     rawPayload: row.raw,
  //   })),
  //   skipDuplicates: true,
  // })

  const response: ImportApiResponse = {
    success: true,
    stats: {
      total: body.rows.length,
      valid: validRows.length,
      warnings: body.rows.filter((row) => row.warnings.length > 0).length,
      errors: body.rows.filter((row) => row.errors.length > 0).length,
      imported,
      skipped,
    },
    message: `${imported} data absensi valid berhasil diproses dari ${body.fileName}. ${skipped} duplikat dilewati.`,
  };

  return NextResponse.json(response);
}
