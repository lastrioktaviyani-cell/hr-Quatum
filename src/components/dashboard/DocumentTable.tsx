"use client";

import { useMemo, useState, type ComponentType, type FormEvent } from "react";
import { Download, Eye, FileSpreadsheet, FileText, FileType, Search, UploadCloud } from "lucide-react";

import type { DocumentRow } from "@/lib/mock-data";

const TYPE_META: Record<DocumentRow["type"], { cls: string; Icon: ComponentType<{ size?: number }> }> = {
  PDF: { cls: "bg-red-50 text-red-600 ring-red-100", Icon: FileText },
  DOCX: { cls: "bg-blue-50 text-blue-600 ring-blue-100", Icon: FileType },
  XLSX: { cls: "bg-emerald-50 text-emerald-600 ring-emerald-100", Icon: FileSpreadsheet },
};

const STATUS_STYLE: Record<DocumentRow["status"], string> = {
  Aktif: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  Draft: "bg-slate-100 text-slate-600 ring-slate-200",
  Review: "bg-amber-50 text-amber-700 ring-amber-100",
};

const DEFAULT_CATEGORIES = ["Kebijakan", "Legal", "Master Data", "Performance"] as const;
const DEFAULT_DEPARTMENTS = ["HC & GA", "Legal", "Operations", "Finance", "Marketing"] as const;
const ACCEPTED_TYPES: Record<string, DocumentRow["type"]> = {
  "application/pdf": "PDF",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "DOCX",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "XLSX",
};

function getCategoryOptions(data: readonly DocumentRow[]): readonly string[] {
  return Array.from(new Set([...DEFAULT_CATEGORIES, ...data.map((doc) => doc.category)])).sort();
}

function matchesSearch(doc: DocumentRow, query: string): boolean {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) return true;

  return [doc.title, doc.category, doc.owner, doc.department, doc.description]
    .join(" ")
    .toLowerCase()
    .includes(normalizedQuery);
}

function formatFileSize(size: number): string {
  if (size >= 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(size / 1024))} KB`;
}

function getDocumentType(file: File): DocumentRow["type"] | null {
  const byMime = ACCEPTED_TYPES[file.type];
  if (byMime) return byMime;

  const extension = file.name.split(".").pop()?.toLowerCase();
  if (extension === "pdf") return "PDF";
  if (extension === "docx") return "DOCX";
  if (extension === "xlsx") return "XLSX";
  return null;
}

export function DocumentTable({ data }: { data: readonly DocumentRow[] }) {
  const [documents, setDocuments] = useState<readonly DocumentRow[]>(data);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [selectedDocumentId, setSelectedDocumentId] = useState(data[0]?.id ?? "");
  const [downloadMessage, setDownloadMessage] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadError, setUploadError] = useState("");
  const categoryOptions = useMemo(() => getCategoryOptions(documents), [documents]);
  const filteredDocuments = useMemo(
    () => documents.filter((doc) => (category === "all" || doc.category === category) && matchesSearch(doc, query)),
    [category, documents, query],
  );
  const selectedDocument = filteredDocuments.find((doc) => doc.id === selectedDocumentId) ?? filteredDocuments[0];

  function handlePreview(doc: DocumentRow): void {
    setSelectedDocumentId(doc.id);
    setDownloadMessage("");
  }

  function handleDownload(doc: DocumentRow): void {
    setSelectedDocumentId(doc.id);
    setDownloadMessage(`Dokumen siap diunduh: ${doc.title}`);
  }

  function handleUpload(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const file = formData.get("file");
    const title = String(formData.get("title") ?? "").trim();
    const selectedCategory = String(formData.get("category") ?? "Kebijakan");
    const department = String(formData.get("department") ?? "HC & GA");
    const owner = String(formData.get("owner") ?? "").trim() || "Admin HRD";
    const description = String(formData.get("description") ?? "").trim() || "Dokumen baru yang diunggah melalui mode demo.";

    setUploadMessage("");
    setUploadError("");

    if (!(file instanceof File) || file.size === 0) {
      setUploadError("Pilih file PDF, DOCX, atau XLSX terlebih dahulu.");
      return;
    }

    const documentType = getDocumentType(file);
    if (!documentType) {
      setUploadError("Format file belum didukung. Gunakan PDF, DOCX, atau XLSX.");
      return;
    }

    if (!title) {
      setUploadError("Judul dokumen wajib diisi.");
      return;
    }

    const newDocument: DocumentRow = {
      id: `upload-${Date.now()}`,
      title,
      category: selectedCategory,
      type: documentType,
      size: formatFileSize(file.size),
      owner,
      department,
      date: "Hari ini",
      status: "Draft",
      description,
      tone: documentType === "PDF" ? "red" : documentType === "DOCX" ? "blue" : "green",
    };

    setDocuments((currentDocuments) => [newDocument, ...currentDocuments]);
    setSelectedDocumentId(newDocument.id);
    setCategory("all");
    setQuery("");
    setDownloadMessage("");
    setUploadMessage(`Upload demo berhasil: ${newDocument.title}`);
    form.reset();
  }

  return (
    <section className="rounded-2xl border border-border bg-card shadow-sm">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 ring-1 ring-blue-500/20">
            📚
          </span>
          <div>
            <h3 className="text-base font-semibold text-foreground">Arsip Dokumen</h3>
            <p className="text-xs text-muted-foreground">
              {filteredDocuments.length} dari {documents.length} dokumen terindeks
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="relative" htmlFor="doc-search">
            <Search
              size={14}
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground/60"
            />
            <input
              id="doc-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari dokumen..."
              className="h-10 w-56 rounded-xl border border-border bg-background/70 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground/60"
            />
          </label>
          <select
            className="h-10 rounded-xl border border-border bg-background/70 px-3 text-sm text-foreground"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            aria-label="Kategori"
          >
            <option value="all">Semua Kategori</option>
            {categoryOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </header>

      <form onSubmit={handleUpload} className="grid gap-3 border-b border-border bg-background/50 p-4 lg:grid-cols-[1.1fr_1fr_0.85fr_0.85fr_auto]">
        <label className="block">
          <span className="text-xs font-semibold text-foreground">File dokumen</span>
          <input
            name="file"
            type="file"
            accept=".pdf,.docx,.xlsx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            className="mt-2 h-10 w-full rounded-xl border border-border bg-card px-3 py-2 text-xs text-muted-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-secondary file:px-2.5 file:py-1 file:text-xs file:font-semibold file:text-primary"
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold text-foreground">Judul</span>
          <input
            name="title"
            type="text"
            placeholder="Nama dokumen"
            className="mt-2 h-10 w-full rounded-xl border border-border bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground/60"
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold text-foreground">Kategori</span>
          <select name="category" className="mt-2 h-10 w-full rounded-xl border border-border bg-card px-3 text-sm text-foreground">
            {categoryOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-xs font-semibold text-foreground">Departemen</span>
          <select name="department" className="mt-2 h-10 w-full rounded-xl border border-border bg-card px-3 text-sm text-foreground">
            {DEFAULT_DEPARTMENTS.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>
        </label>
        <div className="flex items-end">
          <button
            type="submit"
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-hr-primary-hover lg:w-auto"
          >
            <UploadCloud size={15} />
            Upload
          </button>
        </div>
        <label className="block lg:col-span-2">
          <span className="text-xs font-semibold text-foreground">Pemilik</span>
          <input
            name="owner"
            type="text"
            placeholder="Admin HRD"
            className="mt-2 h-10 w-full rounded-xl border border-border bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground/60"
          />
        </label>
        <label className="block lg:col-span-3">
          <span className="text-xs font-semibold text-foreground">Deskripsi</span>
          <input
            name="description"
            type="text"
            placeholder="Ringkasan isi dokumen"
            className="mt-2 h-10 w-full rounded-xl border border-border bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground/60"
          />
        </label>
        <div className="lg:col-span-5">
          <p className="text-xs text-muted-foreground">Upload masih mode demo; file belum disimpan permanen ke server.</p>
          {uploadError && <p className="mt-2 rounded-xl bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700 ring-1 ring-rose-100">{uploadError}</p>}
          {uploadMessage && <p className="mt-2 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700 ring-1 ring-emerald-100">{uploadMessage}</p>}
        </div>
      </form>

      <div className="grid gap-0 lg:grid-cols-[1fr_340px]">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border text-[0.65rem] font-semibold uppercase tracking-widest text-muted-foreground/60">
                <th className="px-5 py-3">Dokumen</th>
                <th className="px-5 py-3">Kategori</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Pemilik</th>
                <th className="px-5 py-3">Tanggal</th>
                <th className="px-5 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocuments.map((doc) => {
                const m = TYPE_META[doc.type];
                const isSelected = selectedDocument?.id === doc.id;

                return (
                  <tr
                    key={doc.id}
                    className={`group border-b border-border/60 transition-colors last:border-0 ${
                      isSelected ? "bg-secondary/50" : "hover:bg-secondary/30"
                    }`}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex size-10 shrink-0 items-center justify-center rounded-lg ring-1 ${m.cls}`}
                        >
                          <m.Icon size={17} />
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-foreground">{doc.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {doc.type} • {doc.size} • {doc.department}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground">
                        {doc.category}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${STATUS_STYLE[doc.status]}`}>
                        {doc.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground">{doc.owner}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{doc.date}</td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          aria-label={`Preview ${doc.title}`}
                          onClick={() => handlePreview(doc)}
                          className="inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          type="button"
                          aria-label={`Unduh ${doc.title}`}
                          onClick={() => handleDownload(doc)}
                          className="inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                        >
                          <Download size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredDocuments.length === 0 && (
            <div className="px-5 py-12 text-center">
              <p className="text-sm font-semibold text-foreground">Dokumen tidak ditemukan</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Coba ubah kata kunci atau pilih kategori lain.
              </p>
            </div>
          )}
        </div>

        <aside className="border-t border-border bg-background/60 p-5 lg:border-t-0 lg:border-l">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Preview</p>
          {selectedDocument ? (
            <div className="mt-4 rounded-2xl border border-border bg-card p-4">
              <h4 className="text-base font-bold text-foreground">{selectedDocument.title}</h4>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{selectedDocument.description}</p>
              <dl className="mt-4 grid gap-3 text-xs">
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Kategori</dt>
                  <dd className="font-semibold text-foreground">{selectedDocument.category}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Departemen</dt>
                  <dd className="font-semibold text-foreground">{selectedDocument.department}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Pemilik</dt>
                  <dd className="font-semibold text-foreground">{selectedDocument.owner}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Status</dt>
                  <dd className="font-semibold text-foreground">{selectedDocument.status}</dd>
                </div>
              </dl>
              <button
                type="button"
                onClick={() => handleDownload(selectedDocument)}
                className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-hr-primary-hover"
              >
                <Download size={15} />
                Download demo
              </button>
            </div>
          ) : (
            <p className="mt-4 rounded-2xl border border-dashed border-border p-4 text-sm text-muted-foreground">
              Pilih dokumen untuk melihat detail.
            </p>
          )}

          {downloadMessage && (
            <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-700 ring-1 ring-emerald-100">
              {downloadMessage}
            </p>
          )}
        </aside>
      </div>
    </section>
  );
}
