import { AppShell } from "@/components/dashboard/AppShell";
import { LeaveTable } from "@/components/dashboard/LeaveTable";
import { StatCard } from "@/components/dashboard/StatCard";
import { LEAVE_REQUESTS } from "@/lib/mock-data";

export const metadata = { title: "Izin & Cuti" };

const STATS = [
  { label: "Total Pengajuan", value: "12", sub: "Bulan Mei", icon: "📋", tone: "blue" as const },
  { label: "Menunggu", value: "3", sub: "Butuh persetujuan", icon: "⏳", tone: "amber" as const },
  { label: "Disetujui", value: "7", sub: "Sudah diproses", icon: "✅", tone: "emerald" as const },
  { label: "Ditolak", value: "2", sub: "Tidak memenuhi syarat", icon: "❌", tone: "rose" as const },
];

export default function IzinCutiPage() {
  return (
    <AppShell title="Izin & Cuti" currentPath="/izin-cuti">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {STATS.map((stat) => <StatCard key={stat.label} stat={stat} />)}
        </section>
        <LeaveTable data={LEAVE_REQUESTS} />
      </div>
    </AppShell>
  );
}
