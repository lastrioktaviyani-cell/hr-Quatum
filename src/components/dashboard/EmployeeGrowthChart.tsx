"use client";

import { AreaTrendChart } from "./AreaTrendChart";

type Point = { label: string; value: number; value2?: number };

export function EmployeeGrowthChart({
  title,
  data,
  tone = "emerald",
}: {
  title?: string;
  data: readonly Point[];
  tone?: "violet" | "emerald" | "amber" | "blue";
}) {
  return (
    <AreaTrendChart
      title={title || "Data Karyawan"}
      data={data}
      tone={tone}
      height={260}
    />
  );
}
