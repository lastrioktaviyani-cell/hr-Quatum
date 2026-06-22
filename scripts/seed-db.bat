@echo off
REM ==============================================
REM  HRD Quantum - Database Setup Script
REM  Untuk Windows (Command Prompt / PowerShell)
REM ==============================================

setlocal enabledelayedexpansion

echo.
echo ==========================================
echo  HRD Quantum - Database Setup
echo ==========================================
echo.

REM Check .env exists
if not exist ".env" (
  echo [ERROR] File .env tidak ditemukan!
  echo.
  echo Buat file .env di root project dengan isi:
  echo   DATABASE_URL=postgresql://postgres.xxx:password@host:5432/postgres
  echo   NEXTAUTH_SECRET=your-secret-here
  echo.
  echo Lihat .env.example untuk template lengkap.
  echo.
  pause
  exit /b 1
)

echo [1/5] Cek .env...
echo       DATABASE_URL: found
echo.

REM Check node_modules
if not exist "node_modules" (
  echo [2/5] Install dependencies...
  call npm install --no-audit --no-fund
  if errorlevel 1 (
    echo [ERROR] npm install gagal. Cek koneksi internet.
    pause
    exit /b 1
  )
) else (
  echo [2/5] Dependencies sudah terinstall
)
echo.

REM Generate Prisma client
echo [3/5] Generate Prisma client...
call npx prisma generate
if errorlevel 1 (
  echo [ERROR] prisma generate gagal
  pause
  exit /b 1
)
echo.

REM Push schema to Supabase
echo [4/5] Push schema ke Supabase...
call npx prisma db push --skip-generate
if errorlevel 1 (
  echo [ERROR] prisma db push gagal
  echo Pastikan DATABASE_URL benar dan Supabase dapat diakses.
  pause
  exit /b 1
)
echo.

REM Seed data
echo [5/5] Seed data 10 karyawan + 4 cuti...
call npx prisma db seed
if errorlevel 1 (
  echo [ERROR] prisma db seed gagal
  pause
  exit /b 1
)
echo.

echo ==========================================
echo  [OK] Database setup selesai!
echo ==========================================
echo.
echo  Data yang sudah di-seed:
echo    - 6 roles
echo    - 24 permissions
echo    - 1 admin user
echo    - 10 karyawan (7 aktif)
echo    - 4 sample pengajuan cuti
echo    - 1 KPI template
echo.
echo  Login: admin@perusahaan.com / admin123
echo  Buka: http://localhost:3000
echo.
pause
