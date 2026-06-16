import Link from "next/link";
import { LogOut } from "lucide-react";
import { SIDEBAR_ITEMS } from "@/lib/mock-data";

export function Sidebar({ currentPath = "/" }: { currentPath?: string }) {
  return (
    <aside className="hidden w-[268px] shrink-0 flex-col border-r border-border bg-card/70 backdrop-blur-md lg:flex">
      <div className="flex items-center gap-3 border-b border-border px-5 py-5">
        <span className="flex size-10 items-center justify-center rounded-2xl bg-hr-primary text-sm font-bold text-white shadow-md shadow-blue-200/60">
          HQ
        </span>
        <div className="flex flex-col">
          <span className="text-[0.95rem] font-bold tracking-tight text-foreground">
            Quantum HRD
          </span>
          <span className="text-[0.6rem] font-medium tracking-widest text-muted-foreground/60">
            MANAGEMENT SYSTEM
          </span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pt-5 pb-3" aria-label="Navigasi utama">
        <ul className="flex flex-col gap-1">
          {SIDEBAR_ITEMS.map((item) => {
            const isActive =
              item.href === "/"
                ? currentPath === "/"
                : currentPath.startsWith(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className="group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all"
                >
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 rounded-xl bg-primary shadow-sm shadow-primary/25"
                    />
                  )}

                  <span
                    className={`relative z-10 flex size-8 shrink-0 items-center justify-center rounded-lg transition-all ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-secondary text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                    }`}
                  >
                    <item.icon size={17} strokeWidth={isActive ? 2.5 : 2} />
                  </span>

                  <span
                    className={`relative z-10 transition-colors ${
                      isActive
                        ? "text-white"
                        : "text-foreground/80 group-hover:text-foreground"
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-border p-3">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-secondary text-muted-foreground transition-colors group-hover:bg-red-100">
            <LogOut size={16} />
          </span>
          Logout
        </button>
      </div>
    </aside>
  );
}
