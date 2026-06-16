import type { KeyAbsence } from "@/lib/mock-data";

const TONE: Record<KeyAbsence["tone"], { bg: string; ring: string; text: string }> = {
  blue: { bg: "bg-blue-50", ring: "ring-blue-100", text: "text-blue-700" },
  emerald: { bg: "bg-emerald-50", ring: "ring-emerald-100", text: "text-emerald-700" },
  amber: { bg: "bg-amber-50", ring: "ring-amber-100", text: "text-amber-700" },
  rose: { bg: "bg-rose-50", ring: "ring-rose-100", text: "text-rose-700" },
};

export function KeyAbsenceCards({ data }: { data: readonly KeyAbsence[] }) {
  return (
    <section className="grid grid-cols-3 gap-3">
      {data.map((item) => {
        const t = TONE[item.tone];
        return (
          <article
            key={item.label}
            className={`group relative overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`flex size-11 shrink-0 items-center justify-center rounded-xl text-xl ring-1 ${t.bg} ${t.bg} ${t.ring}`}
              >
                {item.icon}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-muted-foreground">
                  {item.label}
                </p>
                <strong className="tabular-nums text-2xl font-bold tracking-tight text-foreground">
                  {item.value}
                </strong>
                <span className="text-[0.65rem] text-muted-foreground/60"> kasus</span>
              </div>
            </div>
            <span
              aria-hidden="true"
              className={`absolute -right-3 -bottom-3 size-14 rounded-full ${t.bg} opacity-60 transition-transform group-hover:scale-125`}
            />
          </article>
        );
      })}
    </section>
  );
}
