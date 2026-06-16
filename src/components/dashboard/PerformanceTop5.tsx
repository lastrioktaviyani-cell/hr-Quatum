import { Trophy, Medal, Star } from "lucide-react";

const RANK_STYLE = [
  {
    badge: "bg-gradient-to-br from-amber-400 to-yellow-600 text-white shadow-amber-500/30",
    chip: "bg-amber-50 text-amber-700",
    label: "Juara 1",
  },
  {
    badge: "bg-gradient-to-br from-slate-300 to-slate-500 text-white shadow-slate-400/30",
    chip: "bg-slate-100 text-slate-700",
    label: "Juara 2",
  },
  {
    badge: "bg-gradient-to-br from-orange-300 to-amber-700 text-white shadow-orange-400/30",
    chip: "bg-orange-50 text-orange-700",
    label: "Juara 3",
  },
  {
    badge: "bg-blue-50 text-blue-700",
    chip: "bg-blue-50 text-blue-700",
    label: "Top 4",
  },
  {
    badge: "bg-blue-50 text-blue-700",
    chip: "bg-blue-50 text-blue-700",
    label: "Top 5",
  },
];

type Assessment = {
  readonly id: string;
  readonly name: string;
  readonly avatar: string;
  readonly position: string;
  readonly department: string;
  readonly score: number;
  readonly grade: string;
};

export function PerformanceTop5({ data }: { data: readonly Assessment[] }) {
  const top5 = [...data].sort((a, b) => b.score - a.score).slice(0, 5);

  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <header className="mb-4 flex items-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 ring-1 ring-amber-500/20">
          <Trophy size={17} />
        </span>
        <div>
          <h3 className="text-base font-semibold text-foreground">
            Top 5 Nilai Kinerja Terbaik
          </h3>
          <p className="text-xs text-muted-foreground">
            Peringkat karyawan dengan skor tertinggi
          </p>
        </div>
      </header>

      <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-5">
        {top5.map((row, idx) => {
          const style = RANK_STYLE[idx];
          const Icon = idx < 3 ? Medal : Star;
          return (
            <article
              key={row.id}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`flex size-11 items-center justify-center rounded-xl text-base font-bold shadow-sm ${style.badge}`}
                >
                  {idx + 1}
                </span>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.65rem] font-semibold ${style.chip}`}
                >
                  <Icon size={10} />
                  {style.label}
                </span>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <span
                  className="flex size-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
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
                  <p className="truncate text-[0.7rem] text-muted-foreground">
                    {row.position}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-end justify-between">
                <div>
                  <p className="text-[0.65rem] font-medium uppercase tracking-widest text-muted-foreground">
                    Skor
                  </p>
                  <strong className="text-2xl font-bold text-foreground tabular-nums">
                    {row.score}
                  </strong>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    row.score >= 90
                      ? "bg-emerald-50 text-emerald-700"
                      : row.score >= 80
                        ? "bg-blue-50 text-blue-700"
                        : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {row.grade}
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
