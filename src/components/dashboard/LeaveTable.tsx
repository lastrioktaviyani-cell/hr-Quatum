"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Eye, FileText, Loader2, Plus, X } from "lucide-react";
import { EMPLOYEES, type EmployeeRow, type LeaveRequest } from "@/lib/mock-data";

const STATUS_STYLE: Record<string, { bg: string; text: string; dot: string }> = {
  Menunggu: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  Disetujui: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  Ditolak: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
};

type Tab = "all" | "Menunggu" | "Disetujui" | "Ditolak";
const TABS: { key: Tab; label: string }[] = [
  { key: "all", label: "Semua" },
  { key: "Menunggu", label: "Menunggu" },
  { key: "Disetujui", label: "Disetujui" },
  { key: "Ditolak", label: "Ditolak" },
];

type LeaveState = LeaveRequest & {
  currentStatus: LeaveRequest["status"];
  currentRejectReason?: string;
};

type ApiLeaveType =
  | "CUTI_TAHUNAN"
  | "CUTI_SAKIT"
  | "IZIN"
  | "CUTI_MELAHIRKAN"
  | "CUTI_KHUSUS";

type ApiLeaveStatus = "MENUNGGU" | "DISETUJUI" | "DITOLAK" | "DIBATALKAN";

type ApiEmployee = {
  readonly id: string;
  readonly employeeNumber: string;
  readonly fullName: string;
  readonly department?: string;
};

// Fallback: derive employees from mock-data when API unavailable.
// EmployeeRow.id is like "e1" — we synthesize a stable UUID-like id so
// downstream API call can either use it as-is (mock) or be replaced when real
// employees are loaded. Real DB UUIDs are 36 chars, mock ids are short.
const MOCK_EMPLOYEES: readonly ApiEmployee[] = EMPLOYEES.map((e: EmployeeRow) => ({
  id: e.id,
  employeeNumber: e.nip,
  fullName: e.name,
  department: e.department,
}));

type ApiLeaveRequest = {
  readonly id: string;
  readonly employeeId: string;
  readonly type: ApiLeaveType;
  readonly startDate: string;
  readonly endDate: string;
  readonly durationDays: number;
  readonly reason: string;
  readonly documentUrl: string | null;
  readonly status: ApiLeaveStatus;
  readonly rejectReason: string | null;
  readonly approverId: string | null;
  readonly approvedAt: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly employee: {
    readonly id: string;
    readonly employeeNumber: string;
    readonly fullName: string;
  };
};

const TYPE_LABELS: Record<ApiLeaveType, string> = {
  CUTI_TAHUNAN: "Cuti Tahunan",
  CUTI_SAKIT: "Cuti Sakit",
  IZIN: "Izin",
  CUTI_MELAHIRKAN: "Cuti Melahirkan",
  CUTI_KHUSUS: "Cuti Khusus",
};

const STATUS_LABELS: Record<ApiLeaveStatus, LeaveRequest["status"]> = {
  MENUNGGU: "Menunggu",
  DISETUJUI: "Disetujui",
  DITOLAK: "Ditolak",
  DIBATALKAN: "Menunggu",
};

const AVATAR_PALETTE = [
  "#8b5cf6",
  "#14b8a6",
  "#3b82f6",
  "#ef4444",
  "#f59e0b",
  "#ec4899",
  "#22c55e",
  "#a855f7",
  "#0ea5e9",
  "#1e40af",
];

function pickAvatarColor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return AVATAR_PALETTE[hash % AVATAR_PALETTE.length] ?? AVATAR_PALETTE[0];
}

function formatDateId(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function mapApiToRow(req: ApiLeaveRequest): LeaveState {
  return {
    id: req.id,
    name: req.employee.fullName,
    nip: req.employee.employeeNumber,
    department: "—",
    type: TYPE_LABELS[req.type] ?? req.type,
    startDate: formatDateId(req.startDate),
    endDate: formatDateId(req.endDate),
    duration: `${req.durationDays} Hari`,
    reason: req.reason,
    status: STATUS_LABELS[req.status] ?? "Menunggu",
    avatar: pickAvatarColor(req.employee.id),
    document: req.documentUrl ?? "",
    currentStatus: STATUS_LABELS[req.status] ?? "Menunggu",
    currentRejectReason: req.rejectReason ?? undefined,
  };
}

function calcDays(start: string, end: string): number {
  const a = new Date(`${start}T00:00:00Z`).getTime();
  const b = new Date(`${end}T00:00:00Z`).getTime();
  return Math.floor((b - a) / 86_400_000) + 1;
}

type FormState = {
  employeeId: string;
  type: ApiLeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  documentUrl: string;
};

const EMPTY_FORM: FormState = {
  employeeId: "",
  type: "CUTI_TAHUNAN",
  startDate: "",
  endDate: "",
  reason: "",
  documentUrl: "",
};

export function LeaveTable({ data }: { data: readonly LeaveRequest[] }) {
  const [tab, setTab] = useState<Tab>("all");
  const [requests, setRequests] = useState<readonly LeaveState[]>(
    data.map((req) => ({
      ...req,
      currentStatus: req.status,
      currentRejectReason: req.rejectReason,
    })),
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const [showAjukan, setShowAjukan] = useState(false);
  const [employees, setEmployees] = useState<readonly ApiEmployee[]>([]);
  const [employeeSource, setEmployeeSource] = useState<"api" | "mock">("api");
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loadingContext, setLoadingContext] = useState(false);

  useEffect(() => {
    if (!showAjukan) return;
    let cancelled = false;
    setLoadingContext(true);
    setFormError(null);

    Promise.all([
      fetch("/api/auth/me")
        .then((r) => r.json())
        .catch((e) => ({ success: false, error: String(e) })),
      fetch("/api/employees")
        .then((r) => r.json())
        .catch((e) => ({ success: false, error: String(e) })),
    ])
      .then(([meRes, empRes]) => {
        if (cancelled) return;
        console.log("[AjukanCuti] /api/auth/me:", meRes);
        console.log("[AjukanCuti] /api/employees:", empRes);

        const myEmployeeId: string | null = meRes?.data?.employeeId ?? null;

        let list: ApiEmployee[] = [];
        let source: "api" | "mock" = "mock";
        if (
          empRes?.success === true &&
          Array.isArray(empRes.data) &&
          empRes.data.length > 0
        ) {
          list = empRes.data.map((e: ApiEmployee) => ({
            id: e.id,
            employeeNumber: e.employeeNumber,
            fullName: e.fullName,
          }));
          source = "api";
        } else {
          const reason =
            empRes?.error ??
            (empRes?.success === false
              ? "API returned success=false"
              : "empty/invalid response");
          console.warn(
            `[AjukanCuti] Fallback ke mock-data: ${reason}. Pastikan DB sudah di-seed & DATABASE_URL di-set.`,
          );
          list = [...MOCK_EMPLOYEES];
        }
        setEmployees(list);
        setEmployeeSource(source);

        const prefill =
          (myEmployeeId && list.find((e) => e.id === myEmployeeId)?.id) ||
          list[0]?.id ||
          "";

        setForm((prev) => ({
          ...prev,
          employeeId: prefill,
        }));
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        console.error("[AjukanCuti] Unexpected error:", err);
        setEmployees([...MOCK_EMPLOYEES]);
        setEmployeeSource("mock");
        setForm((prev) => ({ ...prev, employeeId: MOCK_EMPLOYEES[0]?.id ?? "" }));
        setFormError(
          err instanceof Error
            ? `Gagal memuat data (pakai data contoh): ${err.message}`
            : "Gagal memuat data, menggunakan data contoh",
        );
      })
      .finally(() => {
        if (!cancelled) setLoadingContext(false);
      });

    return () => {
      cancelled = true;
    };
  }, [showAjukan]);

  const filtered = useMemo(
    () => (tab === "all" ? requests : requests.filter((r) => r.currentStatus === tab)),
    [requests, tab],
  );

  const selected = requests.find((req) => req.id === selectedId) ?? null;

  function openDetail(req: LeaveState) {
    setSelectedId(req.id);
    setRejectReason(req.currentRejectReason ?? "");
  }

  function approve(id: string) {
    setRequests((current) =>
      current.map((req) =>
        req.id === id
          ? { ...req, currentStatus: "Disetujui", currentRejectReason: undefined }
          : req,
      ),
    );
    setSelectedId(null);
  }

  function reject(id: string) {
    const reason = rejectReason.trim();
    if (!reason) return;

    setRequests((current) =>
      current.map((req) =>
        req.id === id
          ? { ...req, currentStatus: "Ditolak", currentRejectReason: reason }
          : req,
      ),
    );
    setSelectedId(null);
  }

  function closeAjukan() {
    setShowAjukan(false);
    setForm(EMPTY_FORM);
    setFormError(null);
  }

  async function submitAjukan(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    if (!form.employeeId) {
      setFormError("Pilih karyawan terlebih dahulu");
      return;
    }
    if (!form.startDate || !form.endDate) {
      setFormError("Tanggal mulai dan selesai wajib diisi");
      return;
    }
    if (form.endDate < form.startDate) {
      setFormError("Tanggal selesai harus sama atau setelah tanggal mulai");
      return;
    }
    if (form.reason.trim().length < 3) {
      setFormError("Alasan minimal 3 karakter");
      return;
    }

    setSubmitting(true);
    try {
      // Send the human-friendly employeeNumber when the source is the
      // mock list (its ids aren't real DB UUIDs). The server resolves
      // either form into a real employee record.
      const selected = employees.find((e) => e.id === form.employeeId);
      const idOrNumber = employeeSource === "mock"
        ? (selected?.employeeNumber ?? form.employeeId)
        : form.employeeId;

      const res = await fetch("/api/cuti", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId: idOrNumber,
          type: form.type,
          startDate: form.startDate,
          endDate: form.endDate,
          reason: form.reason.trim(),
          documentUrl: form.documentUrl.trim() || null,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        let msg = json.error ?? "Gagal mengajukan cuti";
        if (Array.isArray(json.details) && json.details.length > 0) {
          const fieldErrors = json.details
            .map((d: { path?: (string | number)[]; message?: string }) =>
              `${(d.path ?? []).join(".")}: ${d.message ?? "tidak valid"}`,
            )
            .join("; ");
          if (fieldErrors) msg = `${msg} (${fieldErrors})`;
        }
        setFormError(msg);
        return;
      }
      const created: ApiLeaveRequest = json.data;
      setRequests((current) => [mapApiToRow(created), ...current]);
      closeAjukan();
    } catch (err: unknown) {
      setFormError(
        err instanceof Error ? err.message : "Terjadi kesalahan saat mengajukan cuti",
      );
    } finally {
      setSubmitting(false);
    }
  }

  const durationDays =
    form.startDate && form.endDate && form.endDate >= form.startDate
      ? calcDays(form.startDate, form.endDate)
      : 0;

  return (
    <>
      <section className="rounded-2xl border border-border bg-card shadow-sm">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5">
          <nav className="flex gap-1 rounded-xl bg-secondary/60 p-1" aria-label="Filter">
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition-all ${
                  tab === t.key
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => setShowAjukan(true)}
            className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-primary px-3.5 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/25 transition-colors hover:bg-hr-primary-hover"
          >
            <Plus size={14} /> Ajukan Cuti
          </button>
        </header>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border text-[0.65rem] font-semibold uppercase tracking-widest text-muted-foreground/60">
                <th className="px-5 py-3">No</th>
                <th className="px-5 py-3">Nama</th>
                <th className="px-5 py-3">Jenis</th>
                <th className="px-5 py-3">Tanggal</th>
                <th className="px-5 py-3">Durasi</th>
                <th className="px-5 py-3">Alasan</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-sm text-muted-foreground">
                    Belum ada pengajuan cuti.
                  </td>
                </tr>
              ) : (
                filtered.map((req, i) => {
                  const s = STATUS_STYLE[req.currentStatus];
                  return (
                    <tr
                      key={req.id}
                      className="border-b border-border/60 transition-colors last:border-0 hover:bg-secondary/30"
                    >
                      <td className="px-5 py-3.5 tabular-nums text-xs text-muted-foreground">
                        {(i + 1).toString().padStart(2, "0")}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <span
                            className="flex size-8 shrink-0 items-center justify-center rounded-full text-[0.6rem] font-semibold text-white"
                            style={{ backgroundColor: req.avatar }}
                          >
                            {req.name
                              .split(" ")
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join("")}
                          </span>
                          <div>
                            <span className="font-medium text-foreground">{req.name}</span>
                            <p className="text-xs text-muted-foreground">{req.department}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-muted-foreground">{req.type}</td>
                      <td className="px-5 py-3.5 text-muted-foreground">
                        {req.startDate} - {req.endDate}
                      </td>
                      <td className="px-5 py-3.5 text-muted-foreground">{req.duration}</td>
                      <td className="max-w-[220px] truncate px-5 py-3.5 text-muted-foreground">
                        {req.reason}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${s.bg} ${s.text}`}
                        >
                          <span className={`size-1.5 rounded-full ${s.dot}`} />
                          {req.currentStatus}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => openDetail(req)}
                          aria-label={`Lihat detail ${req.name}`}
                          className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground transition-colors hover:bg-hr-primary-hover"
                        >
                          <Eye size={14} /> Detail
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="leave-detail-title"
        >
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-card shadow-2xl">
            <header className="flex items-start justify-between gap-4 border-b border-border p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Detail Permohonan
                </p>
                <h3 id="leave-detail-title" className="mt-1 text-xl font-bold text-foreground">
                  {selected.type} — {selected.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                aria-label="Tutup modal"
              >
                <X size={18} />
              </button>
            </header>

            <div className="grid gap-5 p-5 lg:grid-cols-[1fr_280px]">
              <div className="space-y-4">
                <section className="rounded-xl border border-border p-4">
                  <h4 className="text-sm font-semibold text-foreground">Informasi Pemohon</h4>
                  <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
                    <div><dt className="text-muted-foreground">Nama</dt><dd className="font-medium text-foreground">{selected.name}</dd></div>
                    <div><dt className="text-muted-foreground">NIP</dt><dd className="font-medium text-foreground">{selected.nip}</dd></div>
                    <div><dt className="text-muted-foreground">Departemen</dt><dd className="font-medium text-foreground">{selected.department}</dd></div>
                    <div><dt className="text-muted-foreground">Status</dt><dd className="font-medium text-foreground">{selected.currentStatus}</dd></div>
                  </dl>
                </section>

                <section className="rounded-xl border border-border p-4">
                  <h4 className="text-sm font-semibold text-foreground">Detail Izin/Cuti</h4>
                  <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
                    <div><dt className="text-muted-foreground">Jenis</dt><dd className="font-medium text-foreground">{selected.type}</dd></div>
                    <div><dt className="text-muted-foreground">Durasi</dt><dd className="font-medium text-foreground">{selected.duration}</dd></div>
                    <div><dt className="text-muted-foreground">Tanggal Mulai</dt><dd className="font-medium text-foreground">{selected.startDate}</dd></div>
                    <div><dt className="text-muted-foreground">Tanggal Selesai</dt><dd className="font-medium text-foreground">{selected.endDate}</dd></div>
                  </dl>
                  <div className="mt-3">
                    <p className="text-sm text-muted-foreground">Alasan</p>
                    <p className="mt-1 rounded-lg bg-secondary/50 p-3 text-sm text-foreground">
                      {selected.reason}
                    </p>
                  </div>
                </section>

                <section className="rounded-xl border border-border p-4">
                  <h4 className="text-sm font-semibold text-foreground">Bukti Dokumen</h4>
                  {selected.document ? (
                    <div className="mt-3 flex items-center gap-3 rounded-lg bg-blue-50 p-3 text-blue-700">
                      <FileText size={18} />
                      <span className="text-sm font-medium">{selected.document}</span>
                    </div>
                  ) : (
                    <p className="mt-3 rounded-lg bg-secondary/50 p-3 text-sm text-muted-foreground">
                      Tidak ada dokumen dilampirkan.
                    </p>
                  )}
                </section>
              </div>

              <aside className="space-y-4">
                <section className="rounded-xl border border-border p-4">
                  <h4 className="text-sm font-semibold text-foreground">Aksi Persetujuan</h4>
                  <div className="mt-3 flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => approve(selected.id)}
                      className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
                    >
                      <Check size={15} /> Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => reject(selected.id)}
                      disabled={!rejectReason.trim()}
                      className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg bg-red-600 px-3 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <X size={15} /> Tolak
                    </button>
                  </div>
                </section>

                <label className="block rounded-xl border border-border p-4">
                  <span className="text-sm font-semibold text-foreground">Alasan Ditolak</span>
                  <textarea
                    value={rejectReason}
                    onChange={(event) => setRejectReason(event.target.value)}
                    rows={5}
                    placeholder="Tulis alasan penolakan agar dapat dilihat oleh user..."
                    className="mt-3 w-full resize-none rounded-lg border border-border bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground/60"
                  />
                  <span className="mt-2 block text-xs text-muted-foreground">
                    Wajib diisi sebelum menolak permohonan.
                  </span>
                </label>
              </aside>
            </div>
          </div>
        </div>
      )}

      {showAjukan && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="ajukan-cuti-title"
        >
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-card shadow-2xl">
            <header className="flex items-start justify-between gap-4 border-b border-border p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Pengajuan Baru
                </p>
                <h3 id="ajukan-cuti-title" className="mt-1 text-xl font-bold text-foreground">
                  Ajukan Izin / Cuti
                </h3>
              </div>
              <button
                type="button"
                onClick={closeAjukan}
                className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                aria-label="Tutup modal"
              >
                <X size={18} />
              </button>
            </header>

            {formError && (
              <div className="m-5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-medium text-rose-700">
                {formError}
              </div>
            )}

            <form className="space-y-4 p-5" onSubmit={submitAjukan}>
              <label className="block">
                <span className="flex items-center justify-between gap-2 text-sm font-semibold text-foreground">
                  <span>Karyawan</span>
                  {employeeSource === "mock" && (
                    <span
                      className="rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700"
                      title="Database tidak terhubung, menampilkan data contoh"
                    >
                      Data contoh
                    </span>
                  )}
                </span>
                <select
                  required
                  value={form.employeeId}
                  onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
                  disabled={loadingContext}
                  className="mt-2 h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground"
                >
                  <option value="">— Pilih karyawan —</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.fullName} ({emp.employeeNumber})
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-foreground">Jenis Cuti</span>
                <select
                  required
                  value={form.type}
                  onChange={(e) =>
                    setForm({ ...form, type: e.target.value as ApiLeaveType })
                  }
                  className="mt-2 h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground"
                >
                  {(Object.keys(TYPE_LABELS) as ApiLeaveType[]).map((k) => (
                    <option key={k} value={k}>
                      {TYPE_LABELS[k]}
                    </option>
                  ))}
                </select>
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold text-foreground">Tanggal Mulai</span>
                  <input
                    type="date"
                    required
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    className="mt-2 h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-foreground">Tanggal Selesai</span>
                  <input
                    type="date"
                    required
                    value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    className="mt-2 h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground"
                  />
                </label>
              </div>

              {durationDays > 0 && (
                <p className="rounded-lg bg-secondary/50 px-3 py-2 text-xs text-muted-foreground">
                  Total durasi: <strong className="text-foreground">{durationDays} hari</strong>
                </p>
              )}

              <label className="block">
                <span className="text-sm font-semibold text-foreground">Alasan</span>
                <textarea
                  required
                  rows={3}
                  minLength={3}
                  maxLength={2000}
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  placeholder="Tuliskan alasan pengajuan..."
                  className="mt-2 w-full resize-none rounded-lg border border-input bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground/60"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-foreground">
                  URL Dokumen Pendukung <span className="text-muted-foreground">(opsional)</span>
                </span>
                <input
                  type="url"
                  value={form.documentUrl}
                  onChange={(e) => setForm({ ...form, documentUrl: e.target.value })}
                  placeholder="https://..."
                  className="mt-2 h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground/60"
                />
              </label>

              <div className="flex items-center justify-end gap-2 border-t border-border pt-4">
                <button
                  type="button"
                  onClick={closeAjukan}
                  disabled={submitting}
                  className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-background px-4 text-sm font-semibold text-foreground transition-colors hover:bg-secondary disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting || loadingContext}
                  className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-hr-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> Mengirim...
                    </>
                  ) : (
                    <>
                      <Plus size={14} /> Kirim Pengajuan
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
