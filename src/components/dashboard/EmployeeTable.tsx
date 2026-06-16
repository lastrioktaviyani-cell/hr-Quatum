"use client";

import { useMemo, useState } from "react";
import { ArrowDownAZ, ArrowUpDown, Building2, Filter, Users } from "lucide-react";
import {
  EMPLOYMENT_LABELS,
  EMPLOYMENT_STYLE,
  type EmployeeRow,
  type EmploymentType,
} from "@/lib/mock-data";

const GENDER_STYLE: Record<EmployeeRow["gender"], string> = {
  Male: "bg-blue-50 text-blue-700",
  Female: "bg-pink-50 text-pink-700",
};

type SortKey = "name" | "nip" | "department" | "dateOfJoin" | "status";
type SortDir = "asc" | "desc";

const SORT_LABEL: Record<SortKey, string> = {
  name: "Nama",
  nip: "NIP",
  department: "Departemen",
  dateOfJoin: "Tanggal Masuk",
  status: "Status",
};

export function EmployeeTable({ data }: { data: readonly EmployeeRow[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [statusFilter, setStatusFilter] = useState<EmploymentType | "all">("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");

  const departments = useMemo(
    () => ["all", ...new Set(data.map((employee) => employee.department))],
    [data],
  );

  const sorted = useMemo(() => {
    const filteredByStatus =
      statusFilter === "all"
        ? [...data]
        : data.filter((employee) => employee.status === statusFilter);

    const filtered =
      departmentFilter === "all"
        ? filteredByStatus
        : filteredByStatus.filter(
            (employee) => employee.department === departmentFilter,
          );

    return filtered.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      const dir = sortDir === "asc" ? 1 : -1;
      return String(av).localeCompare(String(bv)) * dir;
    });
  }, [data, sortKey, sortDir, statusFilter, departmentFilter]);

  const statusOptions: ReadonlyArray<EmploymentType | "all"> = [
    "all",
    "PKWTT",
    "PKWT",
    "Probation",
    "Harian Lepas",
    "Part-Time",
    "Freelancer",
    "Outsourcing",
    "Internship",
  ];

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <header className="flex flex-wrap items-center justify-between gap-3 bg-hr-primary px-5 py-4 text-white">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20">
            <Users size={17} />
          </span>
          <div>
            <h3 className="text-base font-semibold">Daftar Karyawan</h3>
            <p className="text-[0.7rem] opacity-80">
              {sorted.length} dari {data.length} karyawan
            </p>
          </div>
        </div>
      </header>

      <div className="flex flex-wrap items-center gap-2 border-b border-border bg-secondary/30 px-5 py-3">
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
            <option key={key} value={key}>
              {SORT_LABEL[key]}
            </option>
          ))}
        </select>

        <button
          type="button"
          aria-label="Toggle arah sortir"
          onClick={() => setSortDir((prev) => (prev === "asc" ? "desc" : "asc"))}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-xs font-medium text-foreground transition-colors hover:bg-secondary"
        >
          <ArrowUpDown size={13} />
          {sortDir === "asc" ? "A → Z" : "Z → A"}
        </button>

        <span className="mx-1 h-5 w-px bg-border" />

        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <Building2 size={13} /> Per Departemen
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

        <span className="mx-1 h-5 w-px bg-border" />

        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <Filter size={13} /> Status
        </span>
        <select
          aria-label="Filter status"
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value as EmploymentType | "all")
          }
          className="h-9 rounded-lg border border-border bg-card px-2.5 text-xs text-foreground"
        >
          {statusOptions.map((option) => (
            <option key={option} value={option}>
              {option === "all" ? "Semua Status" : EMPLOYMENT_LABELS[option]}
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
              <th className="px-4 py-3">ID Name</th>
              <th className="px-4 py-3">Gender</th>
              <th className="px-4 py-3">Department</th>
              <th className="px-4 py-3">Date of Join</th>
              <th className="px-4 py-3">End Date</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((emp, i) => (
              <tr
                key={emp.id}
                className="border-b border-border/60 transition-colors last:border-0 hover:bg-secondary/30"
              >
                <td className="px-4 py-3.5 tabular-nums text-xs text-muted-foreground">
                  {i + 1}
                </td>
                <td className="px-4 py-3.5 tabular-nums text-xs font-medium text-foreground">
                  {emp.nip}
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="flex size-7 shrink-0 items-center justify-center rounded-full text-[0.6rem] font-bold text-white"
                      style={{ backgroundColor: emp.avatar }}
                    >
                      {emp.name
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")}
                    </span>
                    <span className="font-medium text-foreground">{emp.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <span
                    className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${GENDER_STYLE[emp.gender]}`}
                  >
                    {emp.gender}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-muted-foreground">
                  {emp.department}
                </td>
                <td className="px-4 py-3.5 tabular-nums text-xs text-muted-foreground">
                  {emp.dateOfJoin}
                </td>
                <td className="px-4 py-3.5 tabular-nums text-xs text-muted-foreground">
                  {emp.status === "PKWTT" ? "–" : emp.endDate}
                </td>
                <td className="px-4 py-3.5">
                  <span
                    className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${EMPLOYMENT_STYLE[emp.status]}`}
                  >
                    {EMPLOYMENT_LABELS[emp.status]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
