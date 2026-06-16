import { AppShell } from "@/components/dashboard/AppShell";
import Link from "next/link";
import {
  BarChart,
  FileText,
  TableProperties,
} from "lucide-react";

const KPI_MENU = [
  {
    title: "Input Actual Value",
    description: "Input nilai pencapaian KPI untuk tim Anda.",
    href: "/kpi/input",
    icon: FileText,
    iconClassName: "bg-emerald-50 text-emerald-600",
  },
  {
    title: "Data KPI",
    description: "Melihat data master KPI dan riwayat KPI seluruh karyawan.",
    href: "/kpi/data",
    icon: TableProperties,
    iconClassName: "bg-blue-50 text-blue-600",
  },
  {
    title: "Rekap KPI",
    description: "Melihat ringkasan dan statistik KPI dari waktu ke waktu.",
    href: "/kpi/rekap",
    icon: BarChart,
    iconClassName: "bg-violet-50 text-violet-600",
  },
] as const;

export default function KpiPage() {
  return (
    <AppShell title="KPI Management" currentPath="/kpi">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <section className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-sm">
          <div className="relative z-10">
            <p className="text-sm font-semibold text-primary">Performance Management</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
              KPI Management System
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Kelola Key Performance Indicators (KPI) secara dinamis. Atur template, target, bobot,
              hingga kalkulasi otomatis tanpa menyentuh source code.
            </p>
          </div>
          <div className="absolute top-0 right-0 -mr-16 -mt-16 size-64 rounded-full bg-primary/5 blur-3xl" />
        </section>

        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {KPI_MENU.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex flex-col gap-4 rounded-3xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-md"
            >
              <div className={`flex size-12 items-center justify-center rounded-2xl transition-colors group-hover:bg-primary group-hover:text-white ${item.iconClassName}`}>
                <item.icon size={24} />
              </div>
              <div>
                <h3 className="font-bold text-foreground group-hover:text-primary">{item.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </AppShell>
  );
}
