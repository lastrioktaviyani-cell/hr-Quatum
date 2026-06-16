import { Menu, Bell, Search, ChevronDown } from "lucide-react";

export function Topbar({ title }: { title: string }) {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-card/80 backdrop-blur-xl">
      <div className="flex items-center gap-3 px-4 py-3 lg:px-7">
        <button
          type="button"
          aria-label="Buka menu"
          className="flex size-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground lg:hidden"
        >
          <Menu size={18} />
        </button>

        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            {title}
          </h1>
        </div>

        <label className="relative hidden md:block" htmlFor="topbar-search">
          <span className="sr-only">Cari data</span>
          <Search
            size={15}
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground/60"
          />
          <input
            id="topbar-search"
            type="search"
            placeholder="Cari data HRD..."
            className="h-10 w-72 rounded-xl border border-border bg-background/70 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground/60"
          />
        </label>

        <button
          type="button"
          aria-label="Notifikasi"
          className="relative flex size-10 items-center justify-center rounded-xl border border-border bg-background/70 text-muted-foreground transition-colors hover:text-foreground"
        >
          <Bell size={17} />
          <span className="absolute top-1.5 right-1.5 flex size-4 items-center justify-center rounded-full bg-red-500 text-[0.55rem] font-bold text-white">
            3
          </span>
        </button>

        <button
          type="button"
          className="flex items-center gap-2 rounded-xl border border-border bg-background/70 py-1.5 pr-2 pl-1.5 transition-colors hover:bg-secondary"
          aria-label="Akun Admin HRD"
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-hr-primary text-[0.65rem] font-bold text-white">
            AH
          </span>
          <span className="hidden text-left sm:block">
            <span className="block text-xs font-semibold text-foreground">Admin HRD</span>
            <span className="block text-[0.65rem] text-muted-foreground">HR Manager</span>
          </span>
          <ChevronDown size={14} className="text-muted-foreground" />
        </button>
      </div>
    </header>
  );
}
