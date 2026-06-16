"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

type Point = { label: string; value: number; value2?: number };

export function AbsenceChart({
  title,
  data,
  height = 280,
}: {
  title: string;
  data: readonly Point[];
  height?: number;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <header className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        <div className="flex items-center gap-3 text-xs text-muted-foreground/70">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-blue-600" />
            Absen
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-amber-500" />
            Telat
          </span>
        </div>
      </header>

      <div style={{ height }} className="w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={[...data]} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="absGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563eb" stopOpacity={0.28} />
                <stop offset="100%" stopColor="#2563eb" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#eef2f7" vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#64748b" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#64748b" }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #e2e8f0",
                boxShadow: "0 8px 24px rgb(15 23 42 / 0.08)",
                fontSize: 12,
              }}
            />
            <Area
              type="monotone"
              dataKey="value2"
              name="Telat"
              stroke="#f59e0b"
              strokeWidth={2.5}
              strokeDasharray="5 3"
              fill="transparent"
              dot={{ r: 3, fill: "#f59e0b", stroke: "#fff", strokeWidth: 1.5 }}
            />
            <Area
              type="monotone"
              dataKey="value"
              name="Absen"
              stroke="#1e40af"
              strokeWidth={3}
              fill="url(#absGrad)"
              dot={{ r: 4, fill: "#1e40af", stroke: "#fff", strokeWidth: 2 }}
              activeDot={{ r: 6, stroke: "#1e40af", strokeWidth: 2, fill: "#fff" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
