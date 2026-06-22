import { NextResponse } from "next/server";
import { getDb } from "@/lib/prisma";
import { auth } from "@/lib/auth";

type EmployeeCache = {
  data: Array<{
    id: string;
    employeeNumber: string;
    fullName: string;
  }>;
  expiresAt: number;
};

const CACHE_TTL_MS = 60_000; // 1 minute
type GlobalWithEmployeeCache = typeof globalThis & {
  __employeeCache?: EmployeeCache;
};
const cacheHolder = globalThis as GlobalWithEmployeeCache;

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Tidak terautentikasi" },
        { status: 401 },
      );
    }

    const now = Date.now();
    const cached = cacheHolder.__employeeCache;
    if (cached && cached.expiresAt > now) {
      return NextResponse.json({ success: true, data: cached.data });
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

    cacheHolder.__employeeCache = {
      data: employees,
      expiresAt: now + CACHE_TTL_MS,
    };

    return NextResponse.json({ success: true, data: employees });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
