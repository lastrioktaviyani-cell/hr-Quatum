import type { Stat } from "@/lib/mock-data";

const TONE = {
  violet: "bg-blue-500/10 ring-blue-500/20",
  blue: "bg-blue-500/10 ring-blue-500/20",
  emerald: "bg-emerald-500/10 ring-emerald-500/20",
  amber: "bg-amber-500/10 ring-amber-500/20",
  rose: "bg-rose-500/10 ring-rose-500/20",
  slate: "bg-slate-500/10 ring-slate-500/20",
} as const;

const TEXT_TONE = {
  violet: "text-blue-600",
  blue: "text-blue-600",
  emerald: "text-emerald-600",
  amber: "text-amber-600",
  rose: "text-rose-600",
  slate: "text-slate-600",
} as const;

export function StatCard({ stat }: { stat: Stat }) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start gap-4">
        <span
          className={`flex size-12 shrink-0 items-center justify-center rounded-xl ring-1 ${TONE[stat.tone]}`}
        >
          <span className="text-xl">{stat.icon}</span>
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
          <strong className="tabular-nums text-[1.7rem] font-bold leading-none tracking-tight text-foreground">
            {stat.value}
          </strong>
          <p
            className={`mt-2 flex items-center gap-1 text-xs font-medium ${
              stat.sub.startsWith("+") ? "text-emerald-600" : "text-muted-foreground/60"
            }`}
          >
            {stat.sub}
          </p>
        </div>
      </div>

      <span
        aria-hidden="true"
        className="absolute -right-5 -bottom-5 size-20 rounded-full bg-gradient-to-br from-blue-500/5 to-blue-700/5 transition-transform group-hover:scale-150"
      />
    </article>
  );
}
