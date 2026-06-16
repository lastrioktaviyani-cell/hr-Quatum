"use client";

import { useState } from "react";
import { Calendar, ChevronDown } from "lucide-react";

const PERIODS = [
  "Jan 2024 - Jun 2024",
  "Jul 2023 - Jun 2024",
  "Jan 2024 - Des 2024",
  "Custom...",
] as const;

export function PeriodFilter() {
  const [period, setPeriod] = useState<(typeof PERIODS)[number]>(PERIODS[0]);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <label htmlFor="period-select" className="text-xs font-medium text-muted-foreground">
        Periode
      </label>
      <div className="relative">
        <Calendar
          size={13}
          className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground/60"
        />
        <select
          id="period-select"
          value={period}
          onChange={(e) => setPeriod(e.target.value as (typeof PERIODS)[number])}
          className="h-10 appearance-none rounded-xl border border-border bg-card pl-8 pr-9 text-sm font-medium text-foreground"
        >
          {PERIODS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <ChevronDown
          size={13}
          className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground/60"
        />
      </div>
    </div>
  );
}
