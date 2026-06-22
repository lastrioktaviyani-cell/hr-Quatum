import { AppShell } from "@/components/dashboard/AppShell";
import { LeaveTable } from "@/components/dashboard/LeaveTable";
import { StatCard } from "@/components/dashboard/StatCard";
import { LEAVE_REQUESTS, type LeaveRequest } from "@/lib/mock-data";
import { getDb } from "@/lib/prisma";
import { headers } from "next/headers";

export const metadata = { title: "Izin & Cuti" };

const TYPE_LABELS = {
  CUTI_TAHUNAN: "Cuti Tahunan",
  CUTI_SAKIT: "Cuti Sakit",
  IZIN: "Izin",
  CUTI_MELAHIRKAN: "Cuti Melahirkan",
  CUTI_KHUSUS: "Cuti Khusus",
} as const;

const STATUS_LABELS = {
  MENUNGGU: "Menunggu",
  DISETUJUI: "Disetujui",
  DITOLAK: "Ditolak",
  DIBATALKAN: "Menunggu",
} as const;

const AVATAR_PALETTE = [
  "#8b5cf6", "#14b8a6", "#3b82f6", "#ef4444", "#f59e0b",
  "#ec4899", "#22c55e", "#a855f7", "#0ea5e9", "#1e40af",
];

function pickAvatarColor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return AVATAR_PALETTE[hash % AVATAR_PALETTE.length] ?? AVATAR_PALETTE[0];
}

function formatDateId(iso: Date | string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

type ApiLeave = {
  id: string;
  type: keyof typeof TYPE_LABELS;
  startDate: Date;
  endDate: Date;
  durationDays: number;
  reason: string;
  documentUrl: string | null;
  status: keyof typeof STATUS_LABELS;
  rejectReason: string | null;
  employee: { id: string; employeeNumber: string; fullName: string };
};

async function fetchLeaveRequests(): Promise<readonly LeaveRequest[]> {
  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  const cookie = h.get("cookie") ?? "";
  try {
    const res = await fetch(`${proto}://${host}/api/cuti`, {
      headers: { cookie },
      cache: "no-store",
    });
    if (!res.ok) return LEAVE_REQUESTS;
    const json = await res.json();
    if (!json?.success || !Array.isArray(json.data)) return LEAVE_REQUESTS;
    return json.data.map((r: ApiLeave): LeaveRequest => ({
      id: r.id,
      name: r.employee.fullName,
      nip: r.employee.employeeNumber,
      department: "—",
      type: TYPE_LABELS[r.type] ?? String(r.type),
      startDate: formatDateId(r.startDate),
      endDate: formatDateId(r.endDate),
      duration: `${r.durationDays} Hari`,
      reason: r.reason,
      status: STATUS_LABELS[r.status] ?? "Menunggu",
      avatar: pickAvatarColor(r.employee.id),
      document: r.documentUrl ?? "",
      rejectReason: r.rejectReason ?? undefined,
    }));
  } catch {
    return LEAVE_REQUESTS;
  }
}

const STATS_CACHE_TTL_MS = 60_000;
type StatsCache = {
  data: { total: number; menunggu: number; disetujui: number; ditolak: number };
  expiresAt: number;
};
type GlobalWithStatsCache = typeof globalThis & {
  __statsCache?: StatsCache;
};
const statsCacheHolder = globalThis as GlobalWithStatsCache;

async function fetchStats() {
  const now = Date.now();
  const cached = statsCacheHolder.__statsCache;
  if (cached && cached.expiresAt > now) return cached.data;

  try {
    const db = getDb();
    // Single query using groupBy — 1 connection instead of 4
    const grouped = await db.leaveRequest.groupBy({
      by: ["status"],
      _count: { _all: true },
    });
    const total = grouped.reduce((acc, g) => acc + g._count._all, 0);
    const count = (s: string) =>
      grouped.find((g) => g.status === s)?._count._all ?? 0;
    const data = {
      total,
      menunggu: count("MENUNGGU"),
      disetujui: count("DISETUJUI"),
      ditolak: count("DITOLAK"),
    };
    statsCacheHolder.__statsCache = {
      data,
      expiresAt: now + STATS_CACHE_TTL_MS,
    };
    return data;
  } catch {
    return null;
  }
}

export default async function IzinCutiPage() {
  const [requests, stats] = await Promise.all([
    fetchLeaveRequests(),
    fetchStats(),
  ]);

  const STATS = stats
    ? [
        { label: "Total Pengajuan", value: String(stats.total), sub: "Seluruh periode", icon: "📋", tone: "blue" as const },
        { label: "Menunggu", value: String(stats.menunggu), sub: "Butuh persetujuan", icon: "⏳", tone: "amber" as const },
        { label: "Disetujui", value: String(stats.disetujui), sub: "Sudah diproses", icon: "✅", tone: "emerald" as const },
        { label: "Ditolak", value: String(stats.ditolak), sub: "Tidak memenuhi syarat", icon: "❌", tone: "rose" as const },
      ]
    : [
        { label: "Total Pengajuan", value: "12", sub: "Bulan Mei", icon: "📋", tone: "blue" as const },
        { label: "Menunggu", value: "3", sub: "Butuh persetujuan", icon: "⏳", tone: "amber" as const },
        { label: "Disetujui", value: "7", sub: "Sudah diproses", icon: "✅", tone: "emerald" as const },
        { label: "Ditolak", value: "2", sub: "Tidak memenuhi syarat", icon: "❌", tone: "rose" as const },
      ];

  return (
    <AppShell title="Izin & Cuti" currentPath="/izin-cuti">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {STATS.map((stat) => <StatCard key={stat.label} stat={stat} />)}
        </section>
        <LeaveTable data={requests} />
      </div>
    </AppShell>
  );
}
