"use client";

import { useState } from "react";
import { LockKeyhole, Settings, ShieldCheck, type LucideIcon } from "lucide-react";

import { CreateAccountPanel } from "@/components/dashboard/CreateAccountPanel";
import { RoleManagement } from "@/components/dashboard/RoleManagement";
import { SettingsList } from "@/components/dashboard/SettingsList";
import type { RoleId, RoleRow, SettingRow } from "@/lib/mock-data";

type SettingsTabId = "accounts" | "roles" | "general";

type SettingsTab = {
  readonly id: SettingsTabId;
  readonly label: string;
  readonly description: string;
  readonly icon: LucideIcon;
};

const TABS: readonly SettingsTab[] = [
  {
    id: "accounts",
    label: "Akun",
    description: "Buat akun baru dan atur role awal.",
    icon: LockKeyhole,
  },
  {
    id: "roles",
    label: "Role & Akses",
    description: "Lihat hak akses tiap role pengguna.",
    icon: ShieldCheck,
  },
  {
    id: "general",
    label: "Umum",
    description: "Notifikasi, backup, dan audit sistem.",
    icon: Settings,
  },
] as const;

export function SettingsHub({
  roles,
  settings,
  allowedRoleIds,
}: {
  roles: readonly RoleRow[];
  settings: readonly SettingRow[];
  allowedRoleIds: readonly RoleId[];
}) {
  const [activeTabId, setActiveTabId] = useState<SettingsTabId>("accounts");
  const activeTab = TABS.find((tab) => tab.id === activeTabId) ?? TABS[0];

  return (
    <section className="overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-sm">
      <header className="border-b border-border bg-gradient-to-r from-card via-card to-secondary/60 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Pengaturan Sistem
        </p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-foreground">Pusat Kontrol Pengaturan</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Pilih pengaturan yang ingin dikelola tanpa scroll terlalu panjang.
            </p>
          </div>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
            {activeTab.label}
          </span>
        </div>
      </header>

      <div className="grid gap-0 lg:grid-cols-[220px_minmax(0,1fr)]">
        <nav aria-label="Menu pengaturan" className="border-b border-border bg-background/60 p-3 lg:border-r lg:border-b-0">
          <div className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = tab.id === activeTabId;

              return (
                <button
                  key={tab.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActiveTabId(tab.id)}
                  className={`min-w-[190px] rounded-2xl border p-4 text-left transition-all lg:min-w-0 ${
                    isActive
                      ? "border-primary/30 bg-primary text-primary-foreground shadow-lg shadow-blue-900/10"
                      : "border-border bg-card text-foreground hover:border-primary/30 hover:bg-secondary/70"
                  }`}
                >
                  <span className="flex items-start gap-3">
                    <span
                      className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${
                        isActive ? "bg-white/15" : "bg-secondary text-primary"
                      }`}
                    >
                      <Icon size={18} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-bold">{tab.label}</span>
                      <span className={`mt-1 block text-xs leading-5 ${isActive ? "text-white/75" : "text-muted-foreground"}`}>
                        {tab.description}
                      </span>
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </nav>

        <div className="bg-background/40 p-4 sm:p-5">
          <div className="mb-4 rounded-2xl border border-border bg-card px-4 py-3">
            <h3 className="text-sm font-bold text-foreground">{activeTab.label}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{activeTab.description}</p>
          </div>

          {activeTabId === "accounts" && (
            <CreateAccountPanel roles={roles} allowedRoleIds={allowedRoleIds} />
          )}
          {activeTabId === "roles" && <RoleManagement roles={roles} />}
          {activeTabId === "general" && <SettingsList data={settings} />}
        </div>
      </div>
    </section>
  );
}
