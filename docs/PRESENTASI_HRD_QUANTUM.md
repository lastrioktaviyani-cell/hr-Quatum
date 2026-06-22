# 🎯 Presentasi HRD Quantum
**Sistem Informasi Human Resources Terintegrasi**

---

## 📌 SLIDE 1: Pembukaan

### Apa itu HRD Quantum?

**HRD Quantum** adalah aplikasi web untuk mengelola seluruh proses HR dalam satu platform terpadu.

**🎯 Masalah yang diselesaikan:**
- Data karyawan tersebar di banyak file
- Hitung KPI masih manual & subjektif
- Pengajuan cuti lambat, sering lupa
- Rekap absensi dari fingerprint mesin belum terintegrasi
- Tidak ada audit trail untuk perubahan data sensitif

**✨ Solusi:**
- **Satu workspace** untuk semua modul HR
- **Hitung otomatis** (KPI, durasi cuti, lembur)
- **Approval workflow** (cuti, perubahan data)
- **Import langsung** dari file fingerprint

---

## 📌 SLIDE 2: Gambaran Besar Sistem

### 7 Modul Utama

| # | Modul | Fungsi |
|---|-------|--------|
| 1 | 📊 **Dashboard** | Ringkasan statistik & chart pertumbuhan |
| 2 | 👥 **Karyawan** | Master data, jabatan, kontrak, status keaktifan |
| 3 | 🕐 **Absensi** | Import log fingerprint → rekap harian otomatis |
| 4 | 📝 **Izin & Cuti** | Pengajuan online + approval manager |
| 5 | 📈 **KPI Management** | Template dinamis, input nilai, scoring otomatis |
| 6 | ⚙️ **Pengaturan** | Role, permission, settings sistem |
| 7 | 🔐 **Login & Auth** | NextAuth dengan JWT + RBAC granular |

---

## 📌 SLIDE 3: Tech Stack

### Arsitektur Modern

**🎨 Frontend:**
- Next.js 16 (App Router + React Server Components)
- TypeScript (type-safe)
- Tailwind CSS v4 + shadcn/ui (konsistensi desain)
- Recharts (visualisasi data)

**⚙️ Backend:**
- Next.js Route Handlers (satu codebase, satu server)
- Prisma ORM + PostgreSQL (Supabase)
- NextAuth v5 (autentikasi)
- Zod (validasi input)
- BullMQ + Redis (antrian job async)
- MinIO (object storage dokumen)

**🐳 Infrastructure:**
- Docker multi-stage build
- docker-compose (web + redis + minio)

```
┌──────────┐   ┌──────────────┐   ┌────────────┐
│ Browser  │ → │  Next.js     │ → │ PostgreSQL │
│ (Client) │   │  (Server)    │   │ (Supabase) │
└──────────┘   └──────┬───────┘   └────────────┘
                      ↓
              ┌───────────────┐
              │ Redis + MinIO │
              └───────────────┘
```

---

## 📌 SLIDE 4: Struktur Database

### 6 Domain Model

**1. Auth & RBAC**
- `User`, `Role`, `Permission`, `RolePermission`
- 7 role: SUPER_ADMIN, HR_ADMIN, HR_MANAGER, MANAGER, SUPERVISOR, EMPLOYEE, AUDITOR
- 24 permission granular: `employee.read`, `leave.approve`, `kpi.delete`, dll

**2. Employee Master**
- Data pribadi, kontrak, jabatan, departemen
- Relasi ke posisi (tree organisasi) & kontrak kerja

**3. Attendance**
- `AttendanceRawLog` → log mentah dari mesin fingerprint
- `AttendanceDailySummary` → rekap harian (telat, lembur, status)

**4. Leave**
- 5 jenis cuti: Tahunan, Sakit, Izin, Melahirkan, Khusus
- 4 status: Menunggu, Disetujui, Ditolak, Dibatalkan

**5. KPI**
- Template → Category (bobot %) → Indicator (target, weight, penalty)
- Periode penilaian + assignment per karyawan

**6. Audit Log**
- Track semua perubahan data sensitif (siapa, kapan, apa)

---

## 📌 SLIDE 5: Fitur Unggulan #1 — Pengajuan Cuti Online

### Workflow Cuti

```
Karyawan              Sistem              Manager
    │                    │                    │
    │── Klik "Ajukan" ─→ │                    │
    │                    │ Validasi overlap   │
    │                    │ Insert (MENUNGGU)  │
    │←── Konfirmasi ─────┤                    │
    │                    │── Notifikasi ─────→│
    │                    │                    │
    │                    │←── Approve/Tolak ──┤
    │                    │ Update status      │
    │←── Hasil ──────────┤                    │
```

**Fitur teknis:**
- ✅ Validasi overlap otomatis (tidak bisa cuti dobel)
- ✅ Hitung durasi otomatis (1-365 hari)
- ✅ Upload dokumen pendukung (sakit, dll)
- ✅ Auto-approval workflow (berjenjang sesuai struktur)

---

## 📌 SLIDE 6: Fitur Unggulan #2 — Import Absensi Otomatis

### Dari Mesin Fingerprint ke Rekap Harian

**Sebelum (manual):**
- Download CSV dari mesin
- Buka Excel, copy-paste
- Hitung telat satu-satu
- 1 jam untuk 100 karyawan

**Sekarang (otomatis):**
1. Upload file CSV/XLSX
2. Sistem deteksi kolom otomatis (NIP, Tanggal, Jam, Status)
3. Preview & validasi (cek PIN, format tanggal)
4. Submit → masuk database
5. **Rekap harian terhitung otomatis** (telat, lembur, status)

**Teknologi:**
- `exceljs` untuk parsing XLSX
- Idempotent (tidak duplikat) via `sourceHash`
- Validasi sebelum insert (data bersih masuk DB)

---

## 📌 SLIDE 7: Fitur Unggulan #3 — KPI Scoring Otomatis

### Sistem Penilaian Dinamis

**Konsep:**
- **Template** = blueprint indikator (misal: "Marketing Q1 2026")
- **Category** = kelompok dengan bobot (misal: Performance 60%, Disiplin 40%)
- **Indicator** = target + satuan + tipe (HIGHER_BETTER / LOWER_BETTER)

**Contoh Perhitungan:**
```
Indicator: "Cost Acquisition Iklan"
Target: 70% (LOWER_BETTER)
Bobot: 25%
Actual: 35%

Poin = (70 / 35) × 25 = 50% (maks 25% karena cap di bobot)

Total Performa = Σ semua indicator
Penalty = izin × 5 + telat × 1.5 + ...
Final Score = Performa - Penalty
```

**Kategori:**
- ≥ 90 = **SANGAT BAIK** 🏆
- 75-89 = **BAIK** ✅
- 60-74 = **CUKUP** ⚠️
- < 60 = **KURANG** ❌

**Keunggulan:** Template bisa dibuat tanpa ubah kode (dynamic system).

---

## 📌 SLIDE 8: Keamanan & Role Management

### RBAC (Role-Based Access Control)

**7 Level Akses:**

| Role | Akses |
|------|-------|
| **SUPER_ADMIN** | Full akses semua modul |
| **HR_ADMIN** | Operasional, master data, dokumen |
| **HR_MANAGER** | Data karyawan, absensi, cuti, laporan |
| **MANAGER** | Performa tim, approve KPI, analytics |
| **SUPERVISOR** | Review absensi, input KPI |
| **EMPLOYEE** | Data pribadi, ajukan cuti, lihat KPI sendiri |
| **AUDITOR** | Read-only untuk compliance |

**24 Permission Granular:**
- `employee.read`, `employee.create`, `employee.update`, `employee.delete`
- `leave.create`, `leave.approve`, `leave.reject`
- `attendance.import`, `kpi.delete`, `audit.read`, dll

**Keamanan Tambahan:**
- Password hashing (bcrypt, cost 12)
- JWT session (aman, tidak bisa dimanipulasi)
- Audit log untuk semua perubahan data sensitif
- Validasi input di setiap endpoint (Zod)

---

## 📌 SLIDE 9: Demo Workflow (Contoh Kasus)

### Skenario: Karyawan Ajukan Cuti

**1. Login** (Karyawan)
- Email + password
- Session JWT aktif

**2. Buka menu "Izin & Cuti"**
- Lihat daftar pengajuan sendiri
- Klik tombol "**Ajukan Cuti**"

**3. Isi Form**
- Jenis: Cuti Tahunan
- Tanggal: 10-12 Juni 2026
- Alasan: "Acara keluarga"
- Submit

**4. Sistem Validasi**
- Cek overlap → tidak ada
- Insert ke database → status **MENUNGGU**
- Notifikasi ke manager

**5. Manager Approve**
- Buka detail pengajuan
- Klik "Approve"
- Status → **DISETUJUI**
- Approver tersimpan di log

**6. Rekap Otomatis**
- Dashboard update
- Statistik cuti terhitung

---

## 📌 SLIDE 10: Statistik & Dashboard

### Visualisasi Real-Time

**Dashboard menampilkan:**
- 📊 Total karyawan (256 orang)
- 🟢 Karyawan aktif (98%)
- 🏖️ Izin/cuti aktif (18 pengajuan, 4 menunggu)
- 🗂️ Dokumen arsip (1.284, +87 bulan ini)

**Chart:**
- 📈 Pertumbuhan karyawan (6 bulan)
- 🍩 Distribusi per departemen (Manajemen, Staff, Operator, Lainnya)
- 📊 Tren pengajuan cuti bulanan
- 📉 10 hari terakhir karyawan telat

**Update otomatis** setiap ada perubahan data.

---

## 📌 SLIDE 11: Deployment & Infrastructure

### Setup Production

**Arsitektur:**
```
Internet (103.197.189.57:8080)
    ↓
Docker Container (Next.js)
    ↓
┌─────────────┬──────────────┐
│             │              │
PostgreSQL   Redis         MinIO
(Supabase)   (Queue)       (Storage)
```

**Tech Stack Production:**
- **Database**: Supabase PostgreSQL (managed, auto-backup)
- **Cache/Queue**: Redis 7 (BullMQ untuk job async)
- **Storage**: MinIO (S3-compatible, untuk dokumen)
- **Server**: Next.js standalone (Node 22)

**Docker Multi-Stage:**
- Stage 1: Install dependencies
- Stage 2: Build production bundle
- Stage 3: Runtime (image kecil, hanya production deps)

---

## 📌 SLIDE 12: Roadmap Pengembangan

### Phase 1: MVP (Current) ✅
- ✅ Auth & RBAC
- ✅ Master karyawan
- ✅ Import absensi
- ✅ Pengajuan cuti
- ✅ KPI scoring

### Phase 2: Enhancement (Q3 2026) 🔄
- 🔄 Notifikasi real-time (WebSocket)
- 🔄 Mobile app (React Native)
- 🔄 Integration dengan payroll system
- 🔄 Advanced analytics (ML-based prediction)

### Phase 3: Scale (Q4 2026) 📅
- 📅 Multi-tenant (bisa dipakai banyak perusahaan)
- 📅 API publik untuk integrasi pihak ketiga
- 📅 SSO (Single Sign-On) dengan Google/Microsoft
- 📅 AI assistant untuk HR recommendations

---

## 📌 SLIDE 13: Benefit & Impact

### Untuk Perusahaan

**💰 Efisiensi Biaya**
- Hemat 70% waktu rekap absensi (dari 1 jam → 10 menit)
- Kurangi error hitung manual
- Tidak perlu Excel terpisah

**📊 Data-Driven Decision**
- Lihat tren produktivitas real-time
- Identifikasi masalah cepat (telat, izin)
- Evaluasi KPI objektif

**🔒 Compliance & Audit**
- Audit log lengkap untuk semua perubahan
- Sesuai UU Ketenagakerjaan Indonesia
- Backup otomatis (Supabase)

### Untuk Karyawan

**⚡ Kemudahan**
- Ajukan cuti dari HP/laptop (1 menit)
- Status real-time
- Tidak perlu bolak-balik ke HRD

**📈 Transparansi**
- Lihat KPI sendiri
- Riwayat penilaian
- Riwayat cuti

---

## 📌 SLIDE 14: Kesimpulan

### Kenapa HRD Quantum?

**🎯 Terintegrasi** — Semua modul HR dalam satu platform

**⚡ Otomatis** — Hitung KPI, rekap absensi, durasi cuti

**🔒 Aman** — RBAC granular, audit log, JWT session

**📊 Real-time** — Dashboard update langsung

**🚀 Scalable** — Docker, cloud-ready, multi-tenant capable

**💡 Modern** — Next.js 16, TypeScript, best practices

---

## 📌 SLIDE 15: Q&A

### Terima Kasih! 🙏

**Tim Pengembang:**
- Lead Developer: Ahkmad Prasetia
- Repository: [github.com/lastrioktaviyani-cell/hr-Quatum](https://github.com/lastrioktaviyani-cell/hr-Quatum)

**Demo & Diskusi:**
- Login demo: `admin@perusahaan.com` / `admin123`
- Live URL: `http://103.197.189.57:8080`

---

## 📎 Catatan untuk Presentasi

**Durasi ideal:** 15-20 menit
- 5 menit: Penjelasan konsep & masalah
- 5 menit: Demo live (login → ajukan cuti → approve)
- 5 menit: Tech stack & keamanan
- 5 menit: Q&A

**Tips presentasi:**
1. Mulai dengan masalah (bukan solusi) — biar audience relate
2. Siapkan demo live (backup: screenshot)
3. Tunjukkan 1 workflow end-to-end (cuti) — jangan semua fitur
4. Akhiri dengan ROI/impact, bukan fitur

**File presentasi ini:** `docs/PRESENTASI_HRD_QUANTUM.md`

Anda bisa convert ke slide PowerPoint/Google Slides dengan copy-paste per slide, atau gunakan tool seperti [Marp](https://marp.app/) untuk render langsung ke PPT/PDF.
