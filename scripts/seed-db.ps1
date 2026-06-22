# ==============================================
#  HRD Quantum - Database Setup Script
#  Untuk PowerShell
# ==============================================

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "=========================================="
Write-Host " HRD Quantum - Database Setup"
Write-Host "=========================================="
Write-Host ""

# Check .env
if (-not (Test-Path ".env")) {
  Write-Host "[ERROR] File .env tidak ditemukan!" -ForegroundColor Red
  Write-Host ""
  Write-Host "Buat file .env di root project dengan isi:"
  Write-Host "  DATABASE_URL=postgresql://postgres.xxx:password@host:5432/postgres"
  Write-Host "  NEXTAUTH_SECRET=your-secret-here"
  Write-Host ""
  Write-Host "Lihat .env.example untuk template lengkap."
  exit 1
}

Write-Host "[1/5] Cek .env... OK" -ForegroundColor Green
Write-Host "      DATABASE_URL: found"
Write-Host ""

# Check node_modules
if (-not (Test-Path "node_modules")) {
  Write-Host "[2/5] Install dependencies..." -ForegroundColor Yellow
  npm install --no-audit --no-fund
  if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] npm install gagal. Cek koneksi internet." -ForegroundColor Red
    exit 1
  }
} else {
  Write-Host "[2/5] Dependencies sudah terinstall" -ForegroundColor Green
}
Write-Host ""

# Generate Prisma client
Write-Host "[3/5] Generate Prisma client..."
npx prisma generate
if ($LASTEXITCODE -ne 0) {
  Write-Host "[ERROR] prisma generate gagal" -ForegroundColor Red
  exit 1
}
Write-Host "      OK" -ForegroundColor Green
Write-Host ""

# Push schema
Write-Host "[4/5] Push schema ke Supabase..."
npx prisma db push --skip-generate
if ($LASTEXITCODE -ne 0) {
  Write-Host "[ERROR] prisma db push gagal" -ForegroundColor Red
  Write-Host "Pastikan DATABASE_URL benar dan Supabase dapat diakses."
  exit 1
}
Write-Host "      OK" -ForegroundColor Green
Write-Host ""

# Seed
Write-Host "[5/5] Seed data 10 karyawan + 4 cuti..."
npx prisma db seed
if ($LASTEXITCODE -ne 0) {
  Write-Host "[ERROR] prisma db seed gagal" -ForegroundColor Red
  exit 1
}
Write-Host "      OK" -ForegroundColor Green
Write-Host ""

Write-Host "==========================================" -ForegroundColor Green
Write-Host " [OK] Database setup selesai!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""
Write-Host " Data yang sudah di-seed:"
Write-Host "   - 6 roles"
Write-Host "   - 24 permissions"
Write-Host "   - 1 admin user"
Write-Host "   - 10 karyawan (7 aktif)"
Write-Host "   - 4 sample pengajuan cuti"
Write-Host "   - 1 KPI template"
Write-Host ""
Write-Host " Login: admin@perusahaan.com / admin123"
Write-Host " Buka: http://localhost:3000"
Write-Host ""

Read-Host "Tekan Enter untuk keluar"
