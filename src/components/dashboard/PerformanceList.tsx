import { Star, ChevronRight, MoreHorizontal } from "lucide-react";
import type { Performance } from "@/lib/mock-data";

const GRADE_STYLE: Record<string, { bg: string; text: string }> = {
  "Sangat Baik": { bg: "bg-emerald-50", text: "text-emerald-700" },
  Baik: { bg: "bg-blue-50", text: "text-blue-700" },
  Cukup: { bg: "bg-amber-50", text: "text-amber-700" },
};

export function PerformanceList({ data }: { data: readonly Performance[] }) {
  return (
    <section className="rounded-2xl border border-border bg-card shadow-sm">
      <header className="flex items-center justify-between border-b border-border p-5">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20">
            <Star size={17} />
          </span>
          <div>
            <h3 className="text-base font-semibold text-foreground">
              Penilaian Kerja Terbaru
            </h3>
            <p className="text-xs text-muted-foreground">Periode Mei 2024</p>
          </div>
        </div>
        <a href="/penilaian-kerja" className="text-sm font-semibold text-primary hover:underline">
          Lihat semua
        </a>
      </header>

      <ul className="divide-y divide-border/60">
        {data.map((row) => {
          const grade = GRADE_STYLE[row.grade] ?? { bg: "bg-secondary", text: "text-foreground" };
          return (
            <li
              key={row.id}
              className="group flex items-center gap-4 p-4 transition-colors hover:bg-secondary/30"
            >
              <span
                className="flex size-11 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white shadow-sm"
                style={{ backgroundColor: row.avatar }}
              >
                {row.name
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")}
              </span>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">
                  {row.name}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {row.role} &middot; {row.dept}
                </p>
              </div>

              <div className="hidden flex-col items-end sm:flex">
                <span className="tabular-nums text-base font-bold text-foreground">
                  {row.score}
                </span>
                <span className={`mt-0.5 rounded-full px-2 py-0.5 text-[0.65rem] font-semibold ${grade.bg} ${grade.text}`}>
                  {row.grade}
                </span>
              </div>

              <ChevronRight
                size={16}
                className="shrink-0 text-muted-foreground/40 transition-colors group-hover:text-primary"
              />
            </li>
          );
        })}
      </ul>
    </section>
  );
}
