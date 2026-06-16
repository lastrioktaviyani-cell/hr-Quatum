"use client";

import { useMemo, useState, type ReactNode } from "react";
import { AlertTriangle, CheckCircle2, FileSpreadsheet, Upload, XCircle } from "lucide-react";
import {
  autoMapColumns,
  buildImportStats,
  parseFile,
  parseRows,
  validateRows,
} from "@/lib/attendance-parser";
import type { ColumnMapping, ImportStats, ParsedFile, UploadState, ValidatedRow } from "@/lib/attendance-types";
import { EMPLOYEES } from "@/lib/mock-data";

const MAX_SIZE = 10 * 1024 * 1024;

const FIELD_LABEL: Record<keyof ColumnMapping, string> = {
  pin: "PIN / NIP",
  name: "Nama",
  date: "Tanggal",
  time: "Jam",
  status: "Status Scan",
  device: "Mesin / Device",
};

function emptyStats(): ImportStats {
  return { total: 0, valid: 0, warnings: 0, errors: 0 };
}

export function AttendanceImport() {
  const [state, setState] = useState<UploadState>("idle");
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [parsed, setParsed] = useState<ParsedFile | null>(null);
  const [mapping, setMapping] = useState<ColumnMapping>({
    pin: null,
    name: null,
    date: null,
    time: null,
    status: null,
    device: null,
  });
  const [validated, setValidated] = useState<ValidatedRow[]>([]);
  const [result, setResult] = useState<string | null>(null);

  const knownPins = useMemo(() => EMPLOYEES.map((employee) => employee.nip), []);
  const stats = validated.length > 0 ? buildImportStats(validated) : emptyStats();

  async function handleFile(file: File | null) {
    if (!file) return;
    setError("");
    setResult(null);

    if (file.size > MAX_SIZE) {
      setError("Ukuran file maksimal 10MB.");
      setState("error");
      return;
    }

    try {
      setState("parsing");
      setFileName(file.name);
      const parsedFile = await parseFile(file);
      const autoMapping = autoMapColumns(parsedFile.headers);
      const rows = parseRows(parsedFile.headers, parsedFile.rows, autoMapping);
      const validatedRows = validateRows(rows, knownPins);

      setParsed(parsedFile);
      setMapping(autoMapping);
      setValidated(validatedRows);
      setState("preview");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal membaca file.");
      setState("error");
    }
  }

  function updateMapping(field: keyof ColumnMapping, value: string) {
    if (!parsed) return;
    const next = { ...mapping, [field]: value === "none" ? null : value };
    const rows = parseRows(parsed.headers, parsed.rows, next);
    setMapping(next);
    setValidated(validateRows(rows, knownPins));
  }

  async function importRows() {
    const validRows = validated.filter((row) => row.isValid);
    if (validRows.length === 0) return;

    setState("importing");
    const response = await fetch("/api/attendance/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rows: validRows, fileName }),
    });
    const json = (await response.json()) as { message?: string };

    const history = JSON.parse(localStorage.getItem("attendance_import_history") ?? "[]") as unknown[];
    localStorage.setItem(
      "attendance_import_history",
      JSON.stringify([
        { fileName, importedAt: new Date().toISOString(), stats: buildImportStats(validRows) },
        ...history,
      ]),
    );

    setResult(json.message ?? "Data berhasil diproses.");
    setState("done");
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-primary">Upload Fingerprint</p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-foreground">
              Import Data Absensi dari Mesin Fingerprint
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Upload file Excel/CSV dari mesin fingerprint. Sistem akan membaca, merapikan, validasi PIN/NIP, lalu menyiapkan data untuk disimpan ke database absensi.
            </p>
          </div>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            XLSX / CSV · Maks. 10MB
          </span>
        </div>

        <label className="mt-6 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-secondary/30 px-6 py-10 text-center transition-colors hover:border-primary hover:bg-blue-50/60">
          <Upload size={34} className="text-primary" />
          <span className="mt-3 text-sm font-semibold text-foreground">
            Klik untuk upload file fingerprint
          </span>
          <span className="mt-1 text-xs text-muted-foreground">
            Format .xlsx, .xls, atau .csv
          </span>
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            className="sr-only"
            onChange={(event) => handleFile(event.target.files?.[0] ?? null)}
          />
        </label>

        {error && (
          <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}
      </section>

      {parsed && (
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <header className="mb-4 flex items-center gap-3">
            <FileSpreadsheet size={18} className="text-primary" />
            <div>
              <h3 className="text-base font-semibold text-foreground">Mapping Kolom</h3>
              <p className="text-xs text-muted-foreground">File: {fileName}</p>
            </div>
          </header>

          <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
            {(Object.keys(FIELD_LABEL) as Array<keyof ColumnMapping>).map((field) => (
              <label key={field} className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-muted-foreground">
                  {FIELD_LABEL[field]}
                </span>
                <select
                  value={mapping[field] ?? "none"}
                  onChange={(event) => updateMapping(field, event.target.value)}
                  className="h-10 rounded-lg border border-border bg-background px-2 text-xs text-foreground"
                >
                  <option value="none">Tidak dipakai</option>
                  {parsed.headers.map((header) => (
                    <option key={header} value={header}>{header}</option>
                  ))}
                </select>
              </label>
            ))}
          </div>
        </section>
      )}

      {validated.length > 0 && (
        <>
          <section className="grid gap-4 md:grid-cols-4">
            <ImportStat label="Total Row" value={stats.total} tone="blue" />
            <ImportStat label="Valid" value={stats.valid} tone="green" />
            <ImportStat label="Warning" value={stats.warnings} tone="amber" />
            <ImportStat label="Error" value={stats.errors} tone="red" />
          </section>

          <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5">
              <div>
                <h3 className="text-base font-semibold text-foreground">Preview Data</h3>
                <p className="text-xs text-muted-foreground">Menampilkan maksimal 100 row pertama</p>
              </div>
              <button
                type="button"
                onClick={importRows}
                disabled={stats.valid === 0 || state === "importing"}
                className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-hr-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
              >
                <CheckCircle2 size={15} />
                {state === "importing" ? "Mengimpor..." : "Import Data Valid"}
              </button>
            </header>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-hr-primary text-[0.65rem] font-semibold uppercase tracking-widest text-white">
                    <th className="px-4 py-3">Row</th>
                    <th className="px-4 py-3">PIN/NIP</th>
                    <th className="px-4 py-3">Nama</th>
                    <th className="px-4 py-3">Scan At</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Device</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {validated.slice(0, 100).map((row) => (
                    <tr
                      key={`${row.rowNumber}-${row.sourceHash}`}
                      className={`border-b border-border/60 ${row.errors.length > 0 ? "bg-red-50/60" : row.warnings.length > 0 ? "bg-amber-50/50" : "hover:bg-secondary/30"}`}
                    >
                      <td className="px-4 py-3 tabular-nums text-xs text-muted-foreground">{row.rowNumber}</td>
                      <td className="px-4 py-3 font-medium text-foreground">{row.pin || "-"}</td>
                      <td className="px-4 py-3 text-muted-foreground">{row.name ?? "-"}</td>
                      <td className="px-4 py-3 tabular-nums text-xs text-muted-foreground">{row.scanAt ?? "Invalid"}</td>
                      <td className="px-4 py-3 text-muted-foreground">{row.scanType}</td>
                      <td className="px-4 py-3 text-muted-foreground">{row.deviceCode ?? "-"}</td>
                      <td className="px-4 py-3">
                        {row.errors.length > 0 ? (
                          <Badge tone="red" icon={<XCircle size={12} />} text={row.errors.join(", ")} />
                        ) : row.warnings.length > 0 ? (
                          <Badge tone="amber" icon={<AlertTriangle size={12} />} text={row.warnings.join(", ")} />
                        ) : (
                          <Badge tone="green" icon={<CheckCircle2 size={12} />} text="Valid" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      {result && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
          {result}
        </div>
      )}
    </div>
  );
}

function ImportStat({ label, value, tone }: { label: string; value: number; tone: "blue" | "green" | "amber" | "red" }) {
  const cls = {
    blue: "bg-blue-50 text-blue-700 ring-blue-100",
    green: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    amber: "bg-amber-50 text-amber-700 ring-amber-100",
    red: "bg-red-50 text-red-700 ring-red-100",
  }[tone];

  return (
    <article className={`rounded-2xl p-4 ring-1 ${cls}`}>
      <p className="text-xs font-medium opacity-80">{label}</p>
      <strong className="mt-1 block text-3xl font-bold tabular-nums">{value}</strong>
    </article>
  );
}

function Badge({ tone, icon, text }: { tone: "green" | "amber" | "red"; icon: ReactNode; text: string }) {
  const cls = {
    green: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    red: "bg-red-50 text-red-700",
  }[tone];

  return (
    <span className={`inline-flex max-w-[260px] items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${cls}`}>
      {icon}
      <span className="truncate">{text}</span>
    </span>
  );
}
