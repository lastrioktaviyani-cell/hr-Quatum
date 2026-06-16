"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function Last10LateChart({
  data,
  height = 200,
}: {
  data: readonly { date: string; count: number }[];
  height?: number;
}) {
  const max = Math.max(...data.map((d) => d.count));
  const total = data.reduce((s, d) => s + d.count, 0);

  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-foreground">
            Telat 10 Hari Terakhir
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Total {total} kejadian terlambat
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-100">
          <span className="size-1.5 rounded-full bg-amber-500" />
          {data.length} hari
        </span>
      </header>

      <div style={{ height }} className="w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={[...data]}
            margin={{ top: 18, right: 5, bottom: 0, left: -20 }}
          >
            <CartesianGrid stroke="#eef2f7" vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#64748b" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#64748b" }}
              allowDecimals={false}
            />
            <Tooltip
              cursor={{ fill: "rgba(245, 158, 11, 0.05)" }}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #e2e8f0",
                boxShadow: "0 8px 24px rgb(15 23 42 / 0.08)",
                fontSize: 12,
              }}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={28}>
              {data.map((d, i) => (
                <Cell
                  key={i}
                  fill={d.count === max ? "#1e40af" : "#f59e0b"}
                />
              ))}
              <LabelList
                dataKey="count"
                position="top"
                style={{ fontSize: 10, fontWeight: 600, fill: "#475569" }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-3 text-xs text-muted-foreground/70">
        <span className="inline-block size-2 rounded-sm bg-blue-600 align-middle" />{" "}
        tertinggi &middot;{" "}
        <span className="inline-block size-2 rounded-sm bg-amber-500 align-middle" />{" "}
        hari biasa
      </p>
    </section>
  );
}
