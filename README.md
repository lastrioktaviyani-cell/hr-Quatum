# HRD Quantum

Sistem informasi Human Resources: karyawan, kehadiran, cuti, dan analitik.

## 🚀 Quick Start

### 1. Setup Database

Buat file `.env` di root project:

```env
DATABASE_URL=postgresql://user:password@host:5432/hrd_quantum
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
```

Contoh untuk Supabase:
```env
DATABASE_URL=postgresql://postgres.xxxx:password@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres
```

Generate NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

### 2. Install & Migrate

```bash
npm install
npx prisma migrate dev
npx prisma db seed
```

Seed akan membuat:
- 6 role (SUPER_ADMIN, HR_ADMIN, dll)
- 24 permission
- 1 admin user: `admin@perusahaan.com` / `admin123`
- **10 karyawan** (8 aktif, 2 soft-deleted) dari mock-data
- **4 sample pengajuan cuti** (1 menunggu, 1 disetujui, 1 ditolak, 1 menunggu)
- 1 KPI template + 1 period

### 3. Run

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

## 🐳 Docker (Alternative)

```bash
docker-compose up -d
```

## 🧪 Login Demo

```
Email:    admin@perusahaan.com
Password: admin123
```

---

## 📁 Struktur

- `src/app/` — Next.js App Router (halaman + API)
- `src/components/` — React components
- `src/lib/` — utilities & business logic
- `prisma/` — schema, migrations, seed
- `docs/` — dokumentasi

## 📚 Dokumentasi

- [Penjelasan Lengkap](docs/PENJELASAN_SINGKAT.md)
- [Slide Presentasi](docs/PRESENTASI_HRD_QUANTUM.md)

## 🔐 Keamanan

- Jangan commit `.env` (sudah di `.gitignore`)
- Rotate `NEXTAUTH_SECRET` untuk production
- Gunakan password DB yang kuat
