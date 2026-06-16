"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Edit3, LockKeyhole, Search, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ACCOUNT_ROWS } from "@/lib/mock-data";
import type { AccountRow, AccountStatus, RoleId, RoleRow } from "@/lib/mock-data";

const DEPARTMENTS = [
  "HC & GA",
  "Marketing",
  "Branding",
  "Business Development",
  "Upper Funnel",
  "Finance",
  "Management",
] as const;

function getAllowedRoleNames(roles: readonly RoleRow[], allowedRoleIds: readonly RoleId[]): string {
  return roles
    .filter((role) => allowedRoleIds.includes(role.id))
    .map((role) => role.name)
    .join(", ");
}

function getRoleName(roles: readonly RoleRow[], roleId: RoleId): string {
  return roles.find((role) => role.id === roleId)?.name ?? roleId;
}

function matchesAccount(account: AccountRow, roles: readonly RoleRow[], query: string): boolean {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) return true;

  return [account.name, account.email, account.department, account.status, getRoleName(roles, account.roleId)]
    .join(" ")
    .toLowerCase()
    .includes(normalizedQuery);
}

export function CreateAccountPanel({
  roles,
  allowedRoleIds,
}: {
  roles: readonly RoleRow[];
  allowedRoleIds: readonly RoleId[];
}) {
  const [activeRoleId, setActiveRoleId] = useState<RoleId>("hr");
  const [accounts, setAccounts] = useState<readonly AccountRow[]>(ACCOUNT_ROWS);
  const [query, setQuery] = useState("");
  const [editingAccountId, setEditingAccountId] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const activeRole = roles.find((role) => role.id === activeRoleId) ?? roles[0];
  const canManageAccounts = allowedRoleIds.includes(activeRole.id);
  const allowedRoleNames = getAllowedRoleNames(roles, allowedRoleIds);
  const filteredAccounts = useMemo(
    () => accounts.filter((account) => matchesAccount(account, roles, query)),
    [accounts, query, roles],
  );

  function handleCreateAccount(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const roleId = String(formData.get("role")) as RoleId;
    const department = String(formData.get("department") ?? "HC & GA");

    if (!name || !email) {
      setFeedbackMessage("Nama dan email wajib diisi.");
      return;
    }

    const newAccount: AccountRow = {
      id: `acc-${Date.now()}`,
      name,
      email,
      roleId,
      department,
      status: "Aktif",
      lastLogin: "Belum pernah",
    };

    setAccounts((currentAccounts) => [newAccount, ...currentAccounts]);
    setFeedbackMessage(`Akun demo berhasil dibuat: ${newAccount.name}`);
    form.reset();
  }

  function handleSaveAccount(accountId: string, formData: FormData): void {
    const nextRoleId = String(formData.get("role")) as RoleId;
    const nextStatus = String(formData.get("status")) as AccountStatus;

    setAccounts((currentAccounts) =>
      currentAccounts.map((account) =>
        account.id === accountId
          ? {
              ...account,
              roleId: nextRoleId,
              status: nextStatus,
            }
          : account,
      ),
    );
    setEditingAccountId("");
    setFeedbackMessage("Perubahan akun demo berhasil disimpan.");
  }

  function handleToggleStatus(account: AccountRow): void {
    const nextStatus: AccountStatus = account.status === "Aktif" ? "Nonaktif" : "Aktif";

    setAccounts((currentAccounts) =>
      currentAccounts.map((currentAccount) =>
        currentAccount.id === account.id
          ? {
              ...currentAccount,
              status: nextStatus,
            }
          : currentAccount,
      ),
    );
    setFeedbackMessage(`Akun ${account.name} berhasil diubah menjadi ${nextStatus}.`);
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-border p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            User Provisioning
          </p>
          <h3 className="mt-1 text-base font-semibold text-foreground">Manajemen Akun</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Akses fitur ini hanya untuk {allowedRoleNames}.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-primary">
          <UserPlus size={14} />
          {accounts.length} akun
        </span>
      </header>

      <div className="grid gap-4 p-4 xl:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="rounded-2xl border border-border bg-background/70 p-4">
          <label className="block">
            <span className="text-xs font-semibold text-foreground">Simulasi login sebagai</span>
            <select
              value={activeRoleId}
              onChange={(event) => setActiveRoleId(event.target.value as RoleId)}
              className="mt-2 h-11 w-full rounded-xl border border-input bg-card px-3 text-sm font-medium text-foreground shadow-sm transition-colors focus:border-primary"
            >
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </label>

          <div className="mt-4 rounded-2xl bg-secondary p-4">
            <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-muted-foreground">
              Role aktif
            </p>
            <strong className="mt-1 block text-xl text-foreground">{activeRole.name}</strong>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">{activeRole.description}</p>
          </div>

          <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-800">
            Demo akses UI. Enforcement aman tetap perlu auth/session dan validasi role di backend.
          </p>
        </aside>

        {canManageAccounts ? (
          <div className="grid gap-4">
            <form onSubmit={handleCreateAccount} className="grid gap-4 rounded-2xl border border-border bg-background/70 p-4 md:grid-cols-2">
              <label className="block">
                <span className="text-xs font-semibold text-foreground">Nama lengkap</span>
                <input
                  name="name"
                  type="text"
                  placeholder="Nama karyawan"
                  className="mt-2 h-11 w-full rounded-xl border border-input bg-card px-3 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground/70 focus:border-primary"
                />
              </label>

              <label className="block">
                <span className="text-xs font-semibold text-foreground">Email</span>
                <input
                  name="email"
                  type="email"
                  placeholder="nama@perusahaan.com"
                  className="mt-2 h-11 w-full rounded-xl border border-input bg-card px-3 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground/70 focus:border-primary"
                />
              </label>

              <label className="block">
                <span className="text-xs font-semibold text-foreground">Role akun baru</span>
                <select
                  name="role"
                  defaultValue="staff"
                  className="mt-2 h-11 w-full rounded-xl border border-input bg-card px-3 text-sm font-medium text-foreground shadow-sm transition-colors focus:border-primary"
                >
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-xs font-semibold text-foreground">Departemen</span>
                <select
                  name="department"
                  defaultValue="HC & GA"
                  className="mt-2 h-11 w-full rounded-xl border border-input bg-card px-3 text-sm font-medium text-foreground shadow-sm transition-colors focus:border-primary"
                >
                  {DEPARTMENTS.map((department) => (
                    <option key={department} value={department}>
                      {department}
                    </option>
                  ))}
                </select>
              </label>

              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-card p-3 md:col-span-2">
                <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <input type="checkbox" defaultChecked className="size-4 rounded border-input accent-primary" />
                  Kirim kredensial ke email user
                </label>
                <Button type="submit" size="lg" className="h-10 rounded-xl px-4 text-xs font-bold">
                  Buat Akun
                </Button>
              </div>
            </form>

            <div className="rounded-2xl border border-border bg-background/70">
              <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
                <div>
                  <h4 className="text-sm font-bold text-foreground">Daftar Akun</h4>
                  <p className="text-xs text-muted-foreground">Edit role/status atau nonaktifkan akun.</p>
                </div>
                <label className="relative block w-full sm:w-auto" htmlFor="account-search">
                  <Search
                    size={14}
                    className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground/60"
                  />
                  <input
                    id="account-search"
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Cari akun..."
                    className="h-10 w-full rounded-xl border border-border bg-card pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground/60 sm:w-56"
                  />
                </label>
              </header>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-border text-[0.65rem] font-semibold uppercase tracking-widest text-muted-foreground/60">
                      <th className="px-4 py-3">Akun</th>
                      <th className="px-4 py-3">Role</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Last Login</th>
                      <th className="px-4 py-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAccounts.map((account) => {
                      const isEditing = editingAccountId === account.id;

                      return (
                        <tr key={account.id} className="border-b border-border/60 last:border-0 hover:bg-secondary/30">
                          <td className="px-4 py-3">
                            <p className="font-semibold text-foreground">{account.name}</p>
                            <p className="text-xs text-muted-foreground">{account.email} • {account.department}</p>
                          </td>
                          <td className="px-4 py-3">
                            {isEditing ? (
                              <select
                                form={`edit-${account.id}`}
                                name="role"
                                defaultValue={account.roleId}
                                className="h-9 rounded-xl border border-input bg-card px-2 text-xs text-foreground"
                              >
                                {roles.map((role) => (
                                  <option key={role.id} value={role.id}>
                                    {role.name}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                                {getRoleName(roles, account.roleId)}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {isEditing ? (
                              <select
                                form={`edit-${account.id}`}
                                name="status"
                                defaultValue={account.status}
                                className="h-9 rounded-xl border border-input bg-card px-2 text-xs text-foreground"
                              >
                                <option value="Aktif">Aktif</option>
                                <option value="Nonaktif">Nonaktif</option>
                              </select>
                            ) : (
                              <span
                                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                  account.status === "Aktif"
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "bg-slate-100 text-slate-600"
                                }`}
                              >
                                {account.status}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-xs text-muted-foreground">{account.lastLogin}</td>
                          <td className="px-4 py-3 text-right">
                            <div className="inline-flex flex-wrap justify-end gap-1">
                              {isEditing ? (
                                <form
                                  id={`edit-${account.id}`}
                                  onSubmit={(event) => {
                                    event.preventDefault();
                                    handleSaveAccount(account.id, new FormData(event.currentTarget));
                                  }}
                                >
                                  <button
                                    type="submit"
                                    className="rounded-lg bg-primary px-2.5 py-1.5 text-xs font-semibold text-primary-foreground"
                                  >
                                    Simpan
                                  </button>
                                </form>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setEditingAccountId(account.id)}
                                  className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary"
                                >
                                  <Edit3 size={12} />
                                  Edit
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleToggleStatus(account)}
                                className="rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-secondary"
                              >
                                {account.status === "Aktif" ? "Nonaktifkan" : "Aktifkan"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {filteredAccounts.length === 0 && (
                <div className="px-4 py-10 text-center text-sm text-muted-foreground">
                  Akun tidak ditemukan.
                </div>
              )}
            </div>

            {feedbackMessage && (
              <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-700 ring-1 ring-emerald-100">
                {feedbackMessage}
              </p>
            )}
          </div>
        ) : (
          <div className="flex min-h-[360px] items-center justify-center rounded-2xl border border-dashed border-border bg-background/70 p-6 text-center">
            <div className="max-w-sm">
              <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 ring-1 ring-rose-200">
                <LockKeyhole size={22} />
              </span>
              <h4 className="mt-4 text-base font-bold text-foreground">Akses ditolak</h4>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Role {activeRole.name} tidak dapat mengelola akun. Gunakan Super Admin, Admin, atau HR.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
