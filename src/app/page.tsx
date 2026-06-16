import { AppShell } from "@/components/dashboard/AppShell";
import { DonutChart } from "@/components/dashboard/DonutChart";
import { EmployeeGrowthChart } from "@/components/dashboard/EmployeeGrowthChart";
import { PeriodFilter } from "@/components/dashboard/PeriodFilter";
import { StatCard } from "@/components/dashboard/StatCard";
import {
  DASHBOARD_STATS,
  EMPLOYEE_SEGMENTS,
  YEARLY_EMPLOYEE_GROWTH,
} from "@/lib/mock-data";

export default function DashboardPage() {
  return (
    <AppShell title="Dashboard" currentPath="/">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <section className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div className="relative z-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-primary">Quantum King Sulaiman</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
                Selamat datang, Admin HRD 👋
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Pantau dokumen, penilaian kerja, izin & cuti, serta analytics HRD dalam satu workspace.
              </p>
            </div>
            <PeriodFilter />
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {DASHBOARD_STATS.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <EmployeeGrowthChart data={YEARLY_EMPLOYEE_GROWTH} />
          </div>
          <DonutChart
            title="Distribusi Karyawan"
            centerValue="256"
            centerLabel="Total"
            data={EMPLOYEE_SEGMENTS}
          />
        </section>
      </div>
    </AppShell>
  );
}
