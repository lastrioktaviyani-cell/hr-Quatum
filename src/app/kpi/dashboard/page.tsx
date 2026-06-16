import { AppShell } from "@/components/dashboard/AppShell";

export default function DashboardKpiPage() {
  return (
    <AppShell title="KPI Dashboard & Ranking" currentPath="/kpi/dashboard">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <h1 className="text-2xl font-bold">Dashboard KPI</h1>
        <p>Halaman ini untuk melihat ringkasan performa dan ranking karyawan.</p>
      </div>
    </AppShell>
  );
}
