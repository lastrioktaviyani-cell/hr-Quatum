"use client";

import { useMemo, useState } from "react";
import { Check, Eye, FileText, Plus, X } from "lucide-react";
import type { LeaveRequest } from "@/lib/mock-data";

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
              {filtered.map((req, i) => {
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
              })}
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
    </>
  );
}
