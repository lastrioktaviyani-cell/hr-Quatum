import type { MonthlyEmployee } from "@/lib/mock-data";

export function MonthlyEmployeeTable({ data }: { data: readonly MonthlyEmployee[] }) {
  return (
    <section className="rounded-2xl border border-border bg-card shadow-sm">
      <header className="flex items-center justify-between border-b border-border p-5">
        <div>
          <h3 className="text-base font-semibold text-foreground">Data Karyawan per Bulan</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Rekap 6 bulan terakhir
          </p>
        </div>
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
          {data.length} periode
        </span>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border text-[0.65rem] font-semibold uppercase tracking-widest text-muted-foreground/60">
              <th className="px-5 py-3">Periode</th>
              <th className="px-5 py-3 text-right">Total</th>
              <th className="px-5 py-3 text-right">Aktif</th>
              <th className="px-5 py-3 text-right">Cuti/Izin</th>
              <th className="px-5 py-3 text-right">Telat</th>
              <th className="px-5 py-3 text-right">Kehadiran</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => {
              const pct = Math.round((row.active / row.total) * 100);
              return (
                <tr
                  key={row.month}
                  className="border-b border-border/60 transition-colors last:border-0 hover:bg-secondary/30"
                >
                  <td className="px-5 py-3.5 font-medium text-foreground">
                    {row.month}
                  </td>
                  <td className="px-5 py-3.5 text-right tabular-nums text-muted-foreground">
                    {row.total}
                  </td>
                  <td className="px-5 py-3.5 text-right tabular-nums font-semibold text-foreground">
                    {row.active}
                  </td>
                  <td className="px-5 py-3.5 text-right tabular-nums text-amber-600">
                    {row.leave}
                  </td>
                  <td className="px-5 py-3.5 text-right tabular-nums text-rose-600">
                    {row.late}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="ml-auto flex w-28 items-center gap-2">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                        <div
                          className="h-full rounded-full bg-blue-600"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="tabular-nums text-xs font-semibold text-foreground">
                        {pct}%
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
