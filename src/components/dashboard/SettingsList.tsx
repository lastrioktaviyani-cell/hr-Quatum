"use client";

import { useState } from "react";
import type { SettingRow } from "@/lib/mock-data";

export function SettingsList({ data }: { data: readonly SettingRow[] }) {
  const [state, setState] = useState<Record<string, boolean>>(
    Object.fromEntries(data.map((s) => [s.label, s.enabled])),
  );

  return (
    <section className="rounded-2xl border border-border bg-card shadow-sm">
      <header className="border-b border-border p-5">
        <h3 className="text-base font-semibold text-foreground">
          Pengaturan Umum
        </h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Atur preferensi sistem HRD
        </p>
      </header>

      <ul className="divide-y divide-border/60">
        {data.map((row) => {
          const enabled = state[row.label] ?? false;
          return (
            <li
              key={row.label}
              className="flex items-center gap-4 p-4 transition-colors hover:bg-secondary/30"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-xl">
                {row.icon}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground">{row.label}</p>
                <p className="text-xs text-muted-foreground">{row.description}</p>
              </div>
              <button
                role="switch"
                aria-checked={enabled}
                aria-label={row.label}
                type="button"
                onClick={() =>
                  setState((prev) => ({ ...prev, [row.label]: !prev[row.label] }))
                }
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                  enabled ? "bg-primary" : "bg-secondary"
                }`}
              >
                <span
                  className={`inline-block size-5 transform rounded-full bg-white shadow transition-transform ${
                    enabled ? "translate-x-[22px]" : "translate-x-0.5"
                  }`}
                />
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
