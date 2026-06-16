"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Point = { label: string; value: number; value2?: number };

const colorMap = {
  violet: { stroke: "#6366f1", fill: "url(#areaViolet)" },
  emerald: { stroke: "#10b981", fill: "url(#areaEmerald)" },
  amber: { stroke: "#f59e0b", fill: "url(#areaAmber)" },
  blue: { stroke: "#3b82f6", fill: "url(#areaBlue)" },
} as const;

export function AreaTrendChart({
  title,
  data,
  tone = "violet",
  height = 260,
}: {
  title: string;
  data: readonly Point[];
  tone?: keyof typeof colorMap;
  height?: number;
}) {
  const c = colorMap[tone];
  const gradId = c.fill;
  const showDual = data[0]?.value2 !== undefined;

  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <div style={{ height }} className="mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={[...data]} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="areaViolet" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="areaEmerald" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="areaAmber" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="areaBlue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#eef2f7" vertical={false} strokeDasharray="3 3" />
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
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #e2e8f0",
                boxShadow: "0 8px 24px rgb(15 23 42 / 0.08)",
                fontSize: 12,
              }}
            />
            {showDual && (
              <Area
                type="monotone"
                dataKey="value2"
                stroke="#a78bfa"
                strokeWidth={2}
                strokeDasharray="4 3"
                fill="transparent"
                dot={false}
              />
            )}
            <Area
              type="monotone"
              dataKey="value"
              stroke={c.stroke}
              strokeWidth={3}
              fill={gradId}
              dot={{ r: 4, fill: c.stroke, stroke: "#fff", strokeWidth: 2 }}
              activeDot={{ r: 6, stroke: c.stroke, strokeWidth: 2, fill: "#fff" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
