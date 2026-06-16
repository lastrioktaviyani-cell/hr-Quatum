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

type BarPoint = { label: string; value: number };

export function BarChartBlock({
  title,
  data,
  height = 260,
}: {
  title: string;
  data: readonly BarPoint[];
  height?: number;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <div style={{ height }} className="mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={[...data]} margin={{ top: 18, right: 10, bottom: 0, left: -20 }}>
            <CartesianGrid stroke="#eef2f7" vertical={false} />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#64748b" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#64748b" }}
            />
            <Tooltip
              cursor={{ fill: "rgba(99, 102, 241, 0.05)" }}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #e2e8f0",
                boxShadow: "0 8px 24px rgb(15 23 42 / 0.08)",
                fontSize: 12,
              }}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={42}>
              {data.map((_, i) => {
                const colors = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#3b82f6"];
                return <Cell key={i} fill={colors[i % colors.length]} />;
              })}
              <LabelList
                dataKey="value"
                position="top"
                style={{ fontSize: 11, fontWeight: 600, fill: "#475569" }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
