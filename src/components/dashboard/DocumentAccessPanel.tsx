"use client";

import { useState } from "react";
import { LockKeyhole, ShieldCheck } from "lucide-react";

import { DocumentTable } from "@/components/dashboard/DocumentTable";
import type { DocumentRow, RoleId, RoleRow } from "@/lib/mock-data";

function getAllowedRoleNames(roles: readonly RoleRow[], allowedRoleIds: readonly RoleId[]): string {
  return roles
    .filter((role) => allowedRoleIds.includes(role.id))
    .map((role) => role.name)
    .join(", ");
}

export function DocumentAccessPanel({
  documents,
  roles,
  allowedRoleIds,
}: {
  documents: readonly DocumentRow[];
  roles: readonly RoleRow[];
  allowedRoleIds: readonly RoleId[];
}) {
  const [activeRoleId, setActiveRoleId] = useState<RoleId>("manager");
  const activeRole = roles.find((role) => role.id === activeRoleId) ?? roles[0];
  const canAccessDocuments = allowedRoleIds.includes(activeRole.id);
  const allowedRoleNames = getAllowedRoleNames(roles, allowedRoleIds);

  return (
    <section className="flex flex-col gap-4">
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
              <ShieldCheck size={18} />
            </span>
            <div>
              <h3 className="text-sm font-bold text-foreground">Akses Arsip Dokumen</h3>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Bisa diakses oleh {allowedRoleNames}. Demo akses UI; enforcement backend perlu auth/session.
              </p>
            </div>
          </div>

          <label className="block min-w-56">
            <span className="text-xs font-semibold text-foreground">Simulasi login sebagai</span>
            <select
              value={activeRoleId}
              onChange={(event) => setActiveRoleId(event.target.value as RoleId)}
              className="mt-2 h-10 w-full rounded-xl border border-input bg-background px-3 text-sm font-medium text-foreground shadow-sm transition-colors focus:border-primary"
            >
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {canAccessDocuments ? (
        <DocumentTable data={documents} />
      ) : (
        <div className="flex min-h-[420px] items-center justify-center rounded-2xl border border-dashed border-border bg-card p-8 text-center shadow-sm">
          <div className="max-w-md">
            <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 ring-1 ring-rose-200">
              <LockKeyhole size={24} />
            </span>
            <h3 className="mt-5 text-lg font-bold text-foreground">Akses arsip ditolak</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Role {activeRole.name} belum boleh membuka arsip dokumen. Gunakan Manager, HR, Admin, atau Super Admin.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
