import { NextResponse } from "next/server";
import { getDb } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Tidak terautentikasi" },
        { status: 401 },
      );
    }

    const employees = await getDb().employee.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        employeeNumber: true,
        fullName: true,
      },
      orderBy: { fullName: "asc" },
    });

    return NextResponse.json({ success: true, data: employees });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
