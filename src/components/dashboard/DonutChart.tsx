"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { Segment } from "@/lib/mock-data";

export function DonutChart({
  title,
  centerValue,
  centerLabel,
  data,
  height = 220,
}: {
  title: string;
  centerValue: string;
  centerLabel: string;
  data: readonly Segment[];
  height?: number;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <div className="mt-3 grid items-center gap-4 md:grid-cols-[200px_1fr]">
        <div className="relative" style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={[...data]}
                dataKey="value"
                innerRadius={62}
                outerRadius={88}
                stroke="#fff"
                strokeWidth={2}
                paddingAngle={2}
              >
                {data.map((s) => (
                  <Cell key={s.name} fill={s.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 8px 24px rgb(15 23 42 / 0.08)",
                  fontSize: 12,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <strong className="text-2xl font-bold text-foreground">
              {centerValue}
            </strong>
            <span className="text-xs text-muted-foreground">{centerLabel}</span>
          </div>
        </div>

        <ul className="space-y-2.5">
          {data.map((seg) => (
            <li
              key={seg.name}
              className="flex items-center justify-between gap-2 rounded-lg border border-transparent px-2 py-1.5 transition-colors hover:border-border hover:bg-secondary/30"
            >
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <span
                  className="size-2.5 rounded-sm"
                  style={{ backgroundColor: seg.color }}
                />
                {seg.name}
              </span>
              <span className="tabular-nums text-sm font-semibold text-foreground">
                {seg.value}{" "}
                <span className="text-xs text-muted-foreground/60">({seg.pct}%)</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
