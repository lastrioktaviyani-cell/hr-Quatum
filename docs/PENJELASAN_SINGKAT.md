# 📖 Penjelasan HRD Quantum — Bahasa Sederhana

## 🎯 Apa Ini?

**HRD Quantum** itu aplikasi web untuk bagian **HRD (Human Resources Department)** di perusahaan. Tujuannya: **bantu urus semua data karyawan dalam satu tempat**.

Bayangkan Anda punya **kantor HRD digital** yang buka 24 jam. Semua yang dulu harus manual (catat di Excel, hitung satu-satu, bolak-balik tanya manajer), sekarang tinggal klik.

---

## 💼 Masalah yang Dihadapi Perusahaan

Coba bayangkan skenario ini di perusahaan biasa:

**1. Data Karyawan Berantakan** 😵
- Data ada di Excel A, Excel B, sama di buku catatan
- Mau cari data 1 orang? Buka 3 file
- Salah ketik? Data jadi kacau

**2. Hitung Absensi dari Mesin Fingerprint** 🖐️
- Tiap pagi karyawan sidik jari di mesin
- Data tersimpan di mesin itu aja
- HRD harus download → buka Excel → copy-paste → hitung telat satu-satu
- **1 jam cuma untuk 100 orang!**

**3. Pengajuan Cuti Ribet** 📝
- Karyawan mau cuti → tulis di kertas → serahkan ke atasan
- Atasan lupa, kertas hilang
- HRD tidak tahu ada yang cuti
- **Gaib dari sistem**

**4. Penilaian KPI Subjektif** 🎲
- "Menurut saya dia bagus" → tidak ada ukurannya
- Hitung manual di Excel, sering beda rumus
- Tidak ada standar yang jelas

---

## ✨ Solusi: HRD Quantum

HRD Quantum menyelesaikan semua itu dengan **7 menu utama**:

### 1. 📊 Dashboard (Halaman Utama)
```
┌─────────────────────────────────────────┐
│  HRD Quantum                            │
├─────────────────────────────────────────┤
│  👥 Total: 256  🟢 Aktif: 98           │
│  🏖️ Cuti: 18    🗂️ Dokumen: 1.284     │
├─────────────────────────────────────────┤
│  📈 [Grafik Pertumbuhan Karyawan]      │
│  🍩 [Diagram Distribusi Departemen]    │
└─────────────────────────────────────────┘
```
**Fungsi:** Lihat ringkasan perusahaan **dalam 1 layar**. Seperti dashboard mobil — langsung tahu kondisi sekarang.

---

### 2. 👥 Karyawan
**Masalah:** Data 256 orang tersebar di mana-mana.

**Solusi:** Semua data di **1 tabel**. Mau cari? Ketik nama, langsung ketemu. Ada filter: PKWTT (tetap), PKWT (kontrak), Probation, dll.

**Yang disimpan:**
- NIP (nomor induk)
- Nama, jenis kelamin
- Jabatan, departemen
- Tanggal masuk, tanggal habis kontrak
- Status keaktifan

---

### 3. 🕐 Absensi
**Masalah:** Rekap dari mesin fingerprint manual, makan waktu 1 jam.

**Solusi:** 
1. Upload file dari mesin (CSV/XLSX)
2. Sistem **otomatis deteksi** kolom: mana NIP, mana tanggal, mana jam
3. Sistem **validasi**: PIN benar? Tanggal valid? Jam masuk akal?
4. Klik submit → **selesai dalam 5 menit!**

**Yang terjadi di balik layar:**
- Hitung telat otomatis (jam masuk vs jam seharusnya)
- Hitung lembur (jam pulang vs jam seharusnya)
- Hitung durasi kerja
- Kasih status: HADIR, TELAT, IZIN, SAKIT, ALPHA, LIBUR

---

### 4. 📝 Izin & Cuti
**Ini yang baru saja saya fungsikan!** 

**Alur karyawan:**
1. Klik tombol "**Ajukan Cuti**"
2. Isi form: jenis cuti, tanggal, alasan
3. Klik kirim → status jadi **"Menunggu"**

**Alur manager:**
1. Lihat pengajuan masuk
2. Klik "Detail" → baca alasan
3. Klik "**Approve**" atau "**Tolak**" (wajib isi alasan tolak)

**Yang otomatis:**
- ✅ **Cek overlap** — tidak bisa cuti 2x di tanggal yang sama
- ✅ **Hitung durasi** — pilih tanggal, langsung ketemu "5 hari"
- ✅ **Status tracking** — Menunggu → Disetujui/Ditolak

---

### 5. 📈 KPI (Key Performance Indicator)
**Ini fitur paling kompleks.** Singkatnya: **mengukur kinerja karyawan dengan rumus yang jelas**.

**Cara kerja:**

**Step 1:** Bikin template KPI
```
Template: "Marketing Q1 2026"
  └─ Category: Performance (bobot 60%)
      └─ Indicator 1: Cost Acquisition, target 70%, bobot 25%
      └─ Indicator 2: Botol Terjual, target 1000, bobot 20%
      └─ Indicator 3: ... 
  └─ Category: Disiplin (bobot 40%)
      └─ Penalty: Izin tanpa alasan = -5 poin
      └─ Penalty: Telat = -1.5 poin
```

**Step 2:** Karyawan input nilai aktual
- "Botol terjual: 1200" (target 1000)
- Sistem hitung: **(1200/1000) × 20 = 24 poin** (maks 20 karena cap di bobot)

**Step 3:** Sistem hitung final score
```
Total Performa = 24 + ... (semua indicator)
Penalty = 0 (tidak ada telat/izin)
Final Score = Performa - Penalty = 85
Kategori = BAIK (karena ≥ 75)
```

**Keunggulan:** Template bisa dibuat **tanpa ubah kode**. Tambah indikator baru? Tinggal klik-klik di admin.

---

### 6. ⚙️ Pengaturan
**Buat admin IT/HR yang manage sistem:**

**Role Management** — Siapa bisa ngapain?
- SUPER_ADMIN: Full akses
- HR_MANAGER: Kelola karyawan, cuti, absensi
- MANAGER: Approve tim sendiri
- EMPLOYEE: Hanya lihat data sendiri

**Permission Granular** — 24 permission kecil:
- `employee.read` — boleh lihat data karyawan?
- `leave.approve` — boleh approve cuti?
- `kpi.delete` — boleh hapus KPI?
- ... dan seterusnya

Bisa dikombinasi: "Manager boleh approve cuti tapi tidak boleh hapus data master".

---

### 7. 🔐 Login & Auth
**Sistem login aman:**
- Email + password
- Password di-hash (disamarkan) di database
- Session pakai JWT (token aman)
- Tidak bisa masuk tanpa login yang benar

**Login demo:** `admin@perusahaan.com` / `admin123`

---

## 🗄️ Database — Tempat Penyimpanan Data

**Analogi:** Database itu seperti **lemari arsip** dengan banyak laci, masing-masing punya fungsi:

```
📁 Laci AUTH
   └─ Daftar user, password, role

📁 Laci EMPLOYEE  
   └─ Data 256 karyawan

📁 Laci ATTENDANCE
   └─ Log fingerprint + rekap harian

📁 Laci LEAVE
   └─ Pengajuan cuti

📁 Laci KPI
   └─ Template + nilai + skor

📁 Laci AUDIT
   └─ "Siapa ubah apa kapan" (seperti CCTV)
```

**Mengapa PostgreSQL?** Database paling stabil untuk data penting. Dipakai oleh Instagram, Spotify, Netflix.

---

## 🔧 Arsitektur: Bagaimana Semua Terhubung

```
┌──────────────────────────────────────────┐
│  BROWSER (yang Anda buka di laptop)      │
│  - Tampilan UI                           │
│  - Klik tombol, isi form                 │
└─────────────┬────────────────────────────┘
              │ Klik "Ajukan Cuti"
              ↓
┌──────────────────────────────────────────┐
│  SERVER (otak aplikasi)                  │
│  - Terima permintaan                     │
│  - Cek: sudah login? data valid?         │
│  - Simpan ke database                    │
└─────────────┬────────────────────────────┘
              │ INSERT INTO leave_requests
              ↓
┌──────────────────────────────────────────┐
│  DATABASE (tempat simpan)                │
│  - PostgreSQL di Supabase                │
└──────────────────────────────────────────┘
```

**Saat user buka halaman:** Aliran data **mundur** (database → server → browser).

---

## 🆚 Perbandingan: Sebelum vs Sesudah

| Kegiatan | Sebelum (Manual) | Sesudah (HRD Quantum) |
|----------|------------------|------------------------|
| Cari data karyawan | Buka Excel, Ctrl+F | Ketik di search bar, langsung ketemu |
| Rekap absensi 100 orang | 1 jam di Excel | 5 menit (upload file) |
| Ajukan cuti | Tulis di kertas, serahkan | Klik tombol, kirim |
| Approve cuti | Tanda tangan di kertas | Klik di laptop |
| Hitung KPI | Rumus beda-beda antar Excel | Standar, otomatis |
| Audit perubahan | Tidak ada | Tercatat semua (siapa, kapan, apa) |

---

## 🔒 Keamanan

**1. Password Disamarkan**
```
Password asli: "rahasia123"
Yang disimpan: "$2a$12$KIXxPfn..." (acak, tidak bisa dibaca balik)
```

**2. Session Aman (JWT)**
- Login → dapat token
- Token disimpan di cookie (bukan di URL)
- Token expired → harus login lagi

**3. Role-Based Access**
- Karyawan biasa **tidak bisa** hapus data master
- Manager **tidak bisa** akses modul lain di luar timnya
- Audit log mencatat **siapa coba akses apa**

---

## 🚀 Tech Stack — Tools yang Dipakai

| Kategori | Tools | Fungsi |
|----------|-------|--------|
| **Bahasa** | TypeScript | JavaScript tapi lebih aman (cek tipe data) |
| **Framework** | Next.js 16 | Buat web app modern (seperti React tapi lebih lengkap) |
| **UI** | Tailwind CSS + shadcn/ui | Bikin tampilan cantik & konsisten |
| **Database** | PostgreSQL + Prisma | Simpan & ambil data |
| **Auth** | NextAuth | Sistem login |
| **Validasi** | Zod | Cek input user (jangan sampai ada injection) |
| **Chart** | Recharts | Grafik & diagram |
| **Container** | Docker | Bungkus aplikasi jadi 1 paket, gampang deploy |

---

## 📦 Deployment: Cara Pasang ke Server

**Cara lama:** Install Node.js, install PostgreSQL, install Redis, setup satu-satu. 😫

**Cara Docker (yang dipakai):**
```bash
docker-compose up -d
```
**Selesai!** 1 perintah, semua jalan:
- Web app di port 8080
- Redis di port 6379
- MinIO (storage) di port 9095

**Docker** itu seperti **kardus** — masukin semua barang, labelin, kirim. Mau di mana pun tinggal buka kardus, semua isinya utuh.

---

## 🎓 Analogi untuk Memahami

**HRD Quantum itu seperti:**

🏢 **Kantor digital** — semua ruangan HRD ada di sini
- Ruangan "Karyawan" → data karyawan
- Ruangan "Absensi" → rekap kehadiran
- Ruangan "Cuti" → pengajuan cuti
- Ruangan "KPI" → penilaian kinerja
- Ruangan "Pengaturan" → kelola sistem

🚗 **Dashboard mobil** — semua informasi di depan mata
- Speedometer = statistik
- Indikator bahan bakar = karyawan aktif vs total
- Lampu peringatan = yang perlu perhatian (cuti menunggu, telat)

📚 **Buku rapor digital** — tapi untuk seluruh perusahaan
- Tiap karyawan punya "rapor" otomatis
- Rapor dihitung dari rumus yang konsisten
- Orang tua (manager) bisa lihat, anak (karyawan) bisa lihat sendiri

---

## ❓ FAQ (Pertanyaan yang Mungkin Muncul)

**Q: Data aman tidak?**
A: Ada audit log, password di-hash, role-based access. Tapi untuk production, secrets (password DB) harus dipindah ke env file, **jangan** di-commit ke Git.

**Q: Bisa dipakai di HP?**
A: Bisa! Tampilan responsif, tinggal buka di browser HP.

**Q: Kalau offline?**
A: Tidak bisa. Butuh internet karena data di server.

**Q: Bisa integrasi dengan mesin fingerprint merk X?**
A: Bisa, asal mesin-nya bisa export CSV/XLSX. Format umum, sistem akan deteksi otomatis.

**Q: Berapa banyak karyawan yang bisa ditangani?**
A: Dengan PostgreSQL + arsitektur saat ini: **ratusan hingga ribuan** karyawan. Untuk puluhan ribu, perlu optimasi tambahan.

**Q: Bisa custom sesuai kebutuhan perusahaan?**
A: Bisa! Tambah modul baru, ubah alur approval, tambah field. Source code lengkap, tim IT bisa modify.

---

## 🎯 Ringkasan 1 Paragraf

**HRD Quantum** adalah aplikasi web yang **mengotomatisasi pekerjaan HR**: mengelola data karyawan, rekap absensi dari mesin fingerprint, pengajuan cuti online, dan penilaian kinerja dengan rumus otomatis. Dibangun dengan teknologi modern (Next.js, TypeScript, PostgreSQL), aman (RBAC + audit log), dan mudah di-deploy (Docker). Tujuannya: **bikin HRD lebih efisien**, karyawan lebih mudah mengurus kebutuhan sendiri, dan manager punya data akurat untuk ambil keputusan.

---

File ini: `docs/PENJELASAN_SINGKAT.md`

Kalau ada bagian yang masih kurang jelas, tanya aja — saya jelaskan lebih detail. Misalnya:
- "Gimana cara hitung KPI lebih detail?"
- "Apa itu Prisma?"
- "Kenapa pakai Docker?"

Saya bisa jelaskan pakai analogi atau contoh konkret.
