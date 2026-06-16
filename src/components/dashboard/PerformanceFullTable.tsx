"use client";

import { useMemo, useState } from "react";
import { ArrowDownAZ, ArrowUpDown, Building2, Filter, Search, Star } from "lucide-react";

type Assessment = {
  readonly id: string;
  readonly name: string;
  readonly nip: string;
  readonly position: string;
  readonly department: string;
  readonly dateOfJoin: string;
  readonly avatar: string;
  readonly score: number;
  readonly grade: string;
  readonly status: string;
};

type SortKey = "name" | "nip" | "department" | "score" | "grade";
type SortDir = "asc" | "desc";

const SORT_LABEL: Record<SortKey, string> = {
  name: "Nama",
  nip: "NIP",
  department: "Departemen",
  score: "Skor",
  grade: "Predikat",
};

function gradeStyle(grade: string) {
  if (grade === "Sangat Baik") return "bg-emerald-50 text-emerald-700";
  if (grade === "Baik") return "bg-blue-50 text-blue-700";
  return "bg-amber-50 text-amber-700";
}

export function PerformanceFullTable({ data }: { data: readonly Assessment[] }) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("score");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [gradeFilter, setGradeFilter] = useState("all");

  const departments = useMemo(
    () => ["all", ...new Set(data.map((row) => row.department))],
    [data],
  );

  const grades = useMemo(
    () => ["all", ...new Set(data.map((row) => row.grade))],
    [data],
  );

  const rows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const filtered = data.filter((row) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        row.name.toLowerCase().includes(normalizedQuery) ||
        row.nip.includes(normalizedQuery) ||
        row.position.toLowerCase().includes(normalizedQuery);

      const matchesDepartment =
        departmentFilter === "all" || row.department === departmentFilter;
      const matchesGrade = gradeFilter === "all" || row.grade === gradeFilter;

      return matchesQuery && matchesDepartment && matchesGrade;
    });

    return filtered.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      const dir = sortDir === "asc" ? 1 : -1;
      if (typeof av === "number" && typeof bv === "number") return (av - bv) * dir;
      return String(av).localeCompare(String(bv)) * dir;
    });
  }, [data, query, sortKey, sortDir, departmentFilter, gradeFilter]);

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <header className="flex flex-wrap items-center justify-between gap-3 bg-hr-primary px-5 py-4 text-white">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20">
            <Star size={17} />
          </span>
          <div>
            <h3 className="text-base font-semibold">Semua Data Penilaian Kerja</h3>
            <p className="text-[0.7rem] opacity-80">
              {rows.length} dari {data.length} penilaian
            </p>
          </div>
        </div>
      </header>

      <div className="flex flex-wrap items-center gap-2 border-b border-border bg-secondary/30 px-5 py-3">
        <label className="relative" htmlFor="performance-search">
          <Search
            size={13}
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground/60"
          />
          <input
            id="performance-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari nama, NIP, jabatan..."
            className="h-9 w-56 rounded-lg border border-border bg-card pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground/60"
          />
        </label>

        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <ArrowDownAZ size={13} /> Sortir
        </span>
        <select
          aria-label="Urutkan berdasarkan"
          value={sortKey}
          onChange={(event) => setSortKey(event.target.value as SortKey)}
          className="h-9 rounded-lg border border-border bg-card px-2.5 text-xs text-foreground"
        >
          {(Object.keys(SORT_LABEL) as SortKey[]).map((key) => (
            <option key={key} value={key}>{SORT_LABEL[key]}</option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => setSortDir((prev) => (prev === "asc" ? "desc" : "asc"))}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-xs font-medium text-foreground transition-colors hover:bg-secondary"
        >
          <ArrowUpDown size={13} />
          {sortDir === "asc" ? "A → Z" : "Z → A"}
        </button>

        <span className="mx-1 h-5 w-px bg-border" />

        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <Building2 size={13} /> Departemen
        </span>
        <select
          aria-label="Filter departemen"
          value={departmentFilter}
          onChange={(event) => setDepartmentFilter(event.target.value)}
          className="h-9 rounded-lg border border-border bg-card px-2.5 text-xs text-foreground"
        >
          {departments.map((department) => (
            <option key={department} value={department}>
              {department === "all" ? "Semua Departemen" : department}
            </option>
          ))}
        </select>

        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <Filter size={13} /> Predikat
        </span>
        <select
          aria-label="Filter predikat"
          value={gradeFilter}
          onChange={(event) => setGradeFilter(event.target.value)}
          className="h-9 rounded-lg border border-border bg-card px-2.5 text-xs text-foreground"
        >
          {grades.map((grade) => (
            <option key={grade} value={grade}>
              {grade === "all" ? "Semua Predikat" : grade}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="bg-hr-primary text-[0.65rem] font-semibold uppercase tracking-widest text-white">
              <th className="px-4 py-3">No</th>
              <th className="px-4 py-3">NIP</th>
              <th className="px-4 py-3">Nama</th>
              <th className="px-4 py-3">Jabatan</th>
              <th className="px-4 py-3">Departemen</th>
              <th className="px-4 py-3">Tanggal Masuk</th>
              <th className="px-4 py-3">Skor</th>
              <th className="px-4 py-3">Predikat</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.id} className="border-b border-border/60 transition-colors last:border-0 hover:bg-secondary/30">
                <td className="px-4 py-3.5 tabular-nums text-xs text-muted-foreground">{i + 1}</td>
                <td className="px-4 py-3.5 tabular-nums text-xs font-medium text-foreground">{row.nip}</td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="flex size-7 shrink-0 items-center justify-center rounded-full text-[0.6rem] font-bold text-white"
                      style={{ backgroundColor: row.avatar }}
                    >
                      {row.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                    </span>
                    <span className="font-medium text-foreground">{row.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-muted-foreground">{row.position}</td>
                <td className="px-4 py-3.5 text-muted-foreground">{row.department}</td>
                <td className="px-4 py-3.5 tabular-nums text-xs text-muted-foreground">{row.dateOfJoin}</td>
                <td className="px-4 py-3.5 tabular-nums font-bold text-foreground">{row.score}</td>
                <td className="px-4 py-3.5">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${gradeStyle(row.grade)}`}>
                    {row.grade}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-muted-foreground">{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
