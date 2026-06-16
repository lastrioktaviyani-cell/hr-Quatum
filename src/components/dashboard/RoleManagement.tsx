import type { RoleRow } from "@/lib/mock-data";
import { ROLE_PERMISSIONS } from "@/lib/mock-data";

const TONE = {
  violet: "border-blue-200 bg-blue-50/70 text-blue-700",
  blue: "border-sky-200 bg-sky-50/70 text-sky-700",
  emerald: "border-emerald-200 bg-emerald-50/70 text-emerald-700",
  amber: "border-amber-200 bg-amber-50/70 text-amber-700",
  rose: "border-rose-200 bg-rose-50/70 text-rose-700",
  slate: "border-slate-200 bg-slate-50/70 text-slate-700",
} as const;

const DOT_TONE = {
  violet: "bg-blue-500",
  blue: "bg-sky-500",
  emerald: "bg-emerald-500",
  amber: "bg-amber-500",
  rose: "bg-rose-500",
  slate: "bg-slate-500",
} as const;

export function RoleManagement({ roles }: { roles: readonly RoleRow[] }) {
  const totalUsers = roles.reduce((total, role) => total + role.users, 0);

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-border p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Access Control
          </p>
          <h3 className="mt-1 text-base font-semibold text-foreground">
            Manajemen Role &amp; Akses
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Kelola level akses pengguna berdasarkan struktur organisasi HRD.
          </p>
        </div>
        <div className="rounded-2xl bg-secondary px-4 py-3 text-right">
          <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-muted-foreground">
            Total pengguna
          </p>
          <strong className="text-2xl font-bold text-foreground">{totalUsers}</strong>
        </div>
      </header>

      <div className="grid gap-4 p-4 lg:grid-cols-2">
        {roles.map((role) => (
          <article
            key={role.id}
            className="group rounded-2xl border border-border bg-background/70 p-4 transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    aria-hidden="true"
                    className={`size-2.5 rounded-full ${DOT_TONE[role.tone]}`}
                  />
                  <h4 className="text-sm font-bold text-foreground">{role.name}</h4>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[0.65rem] font-semibold ${TONE[role.tone]}`}
                  >
                    {role.isActive ? "Aktif" : "Nonaktif"}
                  </span>
                </div>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  {role.description}
                </p>
              </div>
              <div className="shrink-0 rounded-xl bg-secondary px-3 py-2 text-center">
                <strong className="block text-lg leading-none text-foreground">
                  {role.users}
                </strong>
                <span className="text-[0.65rem] font-medium text-muted-foreground">
                  user
                </span>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {role.permissions.map((permission) => (
                <span
                  key={permission}
                  className="rounded-full bg-secondary px-2.5 py-1 text-[0.7rem] font-medium text-muted-foreground ring-1 ring-border/60"
                >
                  {ROLE_PERMISSIONS[permission]}
                </span>
              ))}
            </div>

            <button
              type="button"
              className="mt-4 inline-flex h-9 items-center rounded-xl border border-border px-3 text-xs font-semibold text-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Atur akses
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
