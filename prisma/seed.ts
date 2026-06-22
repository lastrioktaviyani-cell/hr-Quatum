import { PrismaClient, KpiCalculationType, EmploymentStatus, LeaveStatus, LeaveType } from "@prisma/client";
import bcryptjs from "bcryptjs";

const prisma = new PrismaClient();

// ===== Mock data from src/lib/mock-data.ts =====
type MockEmployee = {
  readonly id: string;
  readonly nip: string;
  readonly name: string;
  readonly gender: "Male" | "Female";
  readonly position: string;
  readonly department: string;
  readonly dateOfJoin: string; // YYYY/MM/DD or DD/MM/YYYY
  readonly endDate: string;
  readonly status: string;
  readonly isActive: boolean;
  readonly avatar: string;
};

const EMPLOYMENT_MAP: Record<string, EmploymentStatus> = {
  PKWTT: "PERMANENT",
  PKWT: "CONTRACT",
  Probation: "PROBATION",
  "Harian Lepas": "CONTRACT",
  "Part-Time": "CONTRACT",
  Freelancer: "FREELANCE",
  Outsourcing: "CONTRACT",
  Internship: "CONTRACT",
};

const MOCK_EMPLOYEES: readonly MockEmployee[] = [
  { id: "e1", nip: "2500165", name: "Amanda Ramadhan", gender: "Male", position: "Advertiser TikTok", department: "Marketing", dateOfJoin: "2025/01/17", endDate: "23/01/2025", status: "Harian Lepas", isActive: false, avatar: "#1e40af" },
  { id: "e2", nip: "2500164", name: "Sinta Aulia", gender: "Female", position: "Social Media Officer", department: "Branding", dateOfJoin: "2025/01/14", endDate: "04/02/2025", status: "PKWT", isActive: false, avatar: "#ec4899" },
  { id: "e3", nip: "2401163", name: "Ella Santania", gender: "Female", position: "Customer Service", department: "Marketing", dateOfJoin: "2024/11/15", endDate: "16/02/2025", status: "PKWT", isActive: false, avatar: "#22c55e" },
  { id: "e4", nip: "2500572", name: "Rizkya Nurfayza Syahpoetri", gender: "Female", position: "Talent Live", department: "Marketing", dateOfJoin: "2025/05/16", endDate: "05/06/2026", status: "PKWT", isActive: true, avatar: "#f59e0b" },
  { id: "e5", nip: "2206011", name: "Syafal Qothi", gender: "Male", position: "TikTok dan New Chanel", department: "Marketing", dateOfJoin: "2022/06/20", endDate: "05/06/2026", status: "PKWTT", isActive: true, avatar: "#3b82f6" },
  { id: "e6", nip: "2209015", name: "Thoriq Al Ghifari", gender: "Male", position: "General Affair", department: "HC & GA", dateOfJoin: "2022/09/02", endDate: "05/06/2026", status: "PKWTT", isActive: true, avatar: "#8b5cf6" },
  { id: "e7", nip: "2110004", name: "Rika Rahman", gender: "Female", position: "Corporate Secreatry", department: "HC & GA", dateOfJoin: "2021/10/01", endDate: "05/06/2026", status: "PKWTT", isActive: true, avatar: "#ef4444" },
  { id: "e8", nip: "2500675", name: "Naura Salsabila", gender: "Female", position: "Sales & Partnership B2B", department: "Bussines Development", dateOfJoin: "2025/06/09", endDate: "05/06/2026", status: "Probation", isActive: true, avatar: "#14b8a6" },
  { id: "e9", nip: "2301020", name: "Bella Intan Yunita", gender: "Female", position: "HC Generalist", department: "HC & GA", dateOfJoin: "2023/01/09", endDate: "11/08/2025", status: "PKWT", isActive: true, avatar: "#a855f7" },
  { id: "e10", nip: "2401162", name: "Bibit Prasetiyo", gender: "Male", position: "Designer", department: "Upper Funnel", dateOfJoin: "2024/11/11", endDate: "07/02/2026", status: "Freelancer", isActive: true, avatar: "#0ea5e9" },
];

// Parse dates in either YYYY/MM/DD or DD/MM/YYYY
function parseDate(s: string): Date | null {
  if (!s) return null;
  if (s.includes("/")) {
    const parts = s.split("/");
    if (parts.length === 3) {
      // Heuristic: if first part is 4 digits, treat as YYYY/MM/DD
      if (parts[0]!.length === 4) {
        return new Date(`${parts[0]}-${parts[1]}-${parts[2]}T00:00:00Z`);
      }
      // Otherwise DD/MM/YYYY
      return new Date(`${parts[2]}-${parts[1]}-${parts[0]}T00:00:00Z`);
    }
  }
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

const LEAVE_SAMPLES: ReadonlyArray<{
  nip: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveStatus;
  documentUrl?: string;
  rejectReason?: string;
}> = [
  {
    nip: "2209015",
    type: "CUTI_TAHUNAN",
    startDate: "2026-05-01",
    endDate: "2026-05-03",
    reason: "Acara keluarga di luar kota",
    status: "MENUNGGU",
    documentUrl: "https://example.com/Surat_Keterangan.pdf",
  },
  {
    nip: "2301020",
    type: "IZIN",
    startDate: "2026-05-05",
    endDate: "2026-05-05",
    reason: "Keperluan pribadi",
    status: "DISETUJUI",
  },
  {
    nip: "2110004",
    type: "CUTI_SAKIT",
    startDate: "2026-05-07",
    endDate: "2026-05-08",
    reason: "Sakit demam tinggi",
    status: "DITOLAK",
    documentUrl: "https://example.com/Surat_Sakit.pdf",
    rejectReason: "Tidak ada surat keterangan dokter yang dilampirkan.",
  },
  {
    nip: "2500675",
    type: "CUTI_TAHUNAN",
    startDate: "2026-05-20",
    endDate: "2026-05-23",
    reason: "Liburan ke Bali",
    status: "MENUNGGU",
    documentUrl: "https://example.com/Bukti_Booking.pdf",
  },
];

function calculateDays(startDate: string, endDate: string): number {
  const start = new Date(`${startDate}T00:00:00Z`).getTime();
  const end = new Date(`${endDate}T00:00:00Z`).getTime();
  return Math.floor((end - start) / 86_400_000) + 1;
}

async function main() {
  console.log("🌱 Seeding database...\n");

  // 1. Create Roles
  const roles = [
    { name: "SUPER_ADMIN", description: "Akses penuh untuk konfigurasi sistem, role, audit, dan seluruh modul HRD." },
    { name: "HR_ADMIN", description: "Mengelola operasional sistem, master data, dokumen, dan pengaturan umum." },
    { name: "HR_MANAGER", description: "Mengelola data karyawan, absensi, cuti, dokumen HR, dan laporan people ops." },
    { name: "MANAGER", description: "Melihat performa tim, menyetujui KPI, dan memantau analytics departemen." },
    { name: "SUPERVISOR", description: "Mengawasi anggota tim, input KPI, review absensi, dan rekomendasi approval." },
    { name: "EMPLOYEE", description: "Akses mandiri untuk melihat data pribadi, pengajuan cuti, dan pencapaian KPI." },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role,
    });
    console.log(`  ✅ Role: ${role.name}`);
  }

  // 2. Create Permissions
  const permissions = [
    "employee.read", "employee.create", "employee.update", "employee.delete",
    "attendance.read", "attendance.import", "attendance.update",
    "leave.read", "leave.create", "leave.approve", "leave.reject",
    "kpi.read", "kpi.create", "kpi.update", "kpi.delete",
    "document.read", "document.upload", "document.delete",
    "settings.read", "settings.update",
    "role.read", "role.manage",
    "audit.read",
    "dashboard.read",
  ];

  for (const action of permissions) {
    await prisma.permission.upsert({
      where: { action },
      update: {},
      create: { action },
    });
  }
  console.log(`  ✅ Permissions: ${permissions.length} created`);

  // 3. Create Admin User
  const hashedPassword = await bcryptjs.hash("admin123", 12);
  const superAdminRole = await prisma.role.findUnique({ where: { name: "SUPER_ADMIN" } });

  const admin = await prisma.user.upsert({
    where: { email: "admin@perusahaan.com" },
    update: {},
    create: {
      name: "Ahkmad Prasetia",
      email: "admin@perusahaan.com",
      password: hashedPassword,
      roleId: superAdminRole?.id,
      emailVerified: new Date(),
    },
  });
  console.log(`  ✅ Admin user: ${admin.email}`);

  // 4. Create 10 sample Employees from mock-data
  console.log("\n📦 Seeding 10 employees from mock-data...");
  const employeeByNip = new Map<string, { id: string; name: string }>();

  for (const emp of MOCK_EMPLOYEES) {
    const joinDate = parseDate(emp.dateOfJoin) ?? new Date("2024-01-01");
    const endDate = parseDate(emp.endDate);

    const created = await prisma.employee.upsert({
      where: { employeeNumber: emp.nip },
      update: {
        fullName: emp.name,
        gender: emp.gender === "Female" ? "FEMALE" : "MALE",
        employmentStatus: EMPLOYMENT_MAP[emp.status] ?? "CONTRACT",
        joinDate,
        endDate,
        deletedAt: emp.isActive ? null : new Date(),
      },
      create: {
        employeeNumber: emp.nip,
        fullName: emp.name,
        gender: emp.gender === "Female" ? "FEMALE" : "MALE",
        employmentStatus: EMPLOYMENT_MAP[emp.status] ?? "CONTRACT",
        joinDate,
        endDate,
        deletedAt: emp.isActive ? null : new Date(),
      },
    });
    employeeByNip.set(emp.nip, { id: created.id, name: created.fullName });
    console.log(`  ✅ Employee: ${created.fullName} (${created.employeeNumber}) [${emp.isActive ? "active" : "soft-deleted"}]`);
  }

  // Link admin to Thoriq (e6) so the admin can submit leave as Thoriq if needed
  const thoriq = employeeByNip.get("2209015");
  if (thoriq) {
    await prisma.user.update({
      where: { id: admin.id },
      data: { employeeId: thoriq.id },
    });
    console.log(`\n  🔗 Linked admin → ${thoriq.name} (employeeId)`);
  }

  // 5. Seed sample leave requests
  console.log("\n📝 Seeding sample leave requests...");
  for (const leave of LEAVE_SAMPLES) {
    const emp = employeeByNip.get(leave.nip);
    if (!emp) {
      console.log(`  ⚠️ Skip leave for ${leave.nip}: employee not found`);
      continue;
    }
    const days = calculateDays(leave.startDate, leave.endDate);

    // Idempotent: delete any prior sample for same employee + date range, then re-insert
    await prisma.leaveRequest.deleteMany({
      where: {
        employeeId: emp.id,
        startDate: new Date(`${leave.startDate}T00:00:00Z`),
        endDate: new Date(`${leave.endDate}T00:00:00Z`),
      },
    });

    await prisma.leaveRequest.create({
      data: {
        employeeId: emp.id,
        type: leave.type,
        startDate: new Date(`${leave.startDate}T00:00:00Z`),
        endDate: new Date(`${leave.endDate}T00:00:00Z`),
        durationDays: days,
        reason: leave.reason,
        documentUrl: leave.documentUrl ?? null,
        status: leave.status,
        rejectReason: leave.rejectReason ?? null,
        approverId: leave.status === "MENUNGGU" ? null : admin.id,
        approvedAt: leave.status === "MENUNGGU" ? null : new Date(),
      },
    });
    console.log(`  ✅ Leave: ${emp.name} | ${leave.type} | ${leave.status}`);
  }

  // 6. Create sample KPI Template
  console.log("\n📈 Seeding KPI template...");
  const existingTemplate = await prisma.kpiTemplate.findFirst({
    where: { name: "Template KPI Marketing Q1 2026" },
  });
  if (!existingTemplate) {
    const template = await prisma.kpiTemplate.create({
      data: {
        name: "Template KPI Marketing Q1 2026",
        description: "Template KPI untuk divisi Marketing periode Q1 2026",
        isActive: true,
      },
    });

    const category = await prisma.kpiCategory.create({
      data: {
        templateId: template.id,
        name: "Performance Penjualan",
        weight: 60,
      },
    });

    await prisma.kpiIndicator.createMany({
      data: [
        { categoryId: category.id, name: "Cost Acquisition Iklan", type: KpiCalculationType.LOWER_BETTER, unit: "Percentage", weight: 25, penalty: 0 },
        { categoryId: category.id, name: "Cost Per Lead", type: KpiCalculationType.LOWER_BETTER, unit: "Currency", weight: 20, penalty: 0 },
        { categoryId: category.id, name: "Botol Terjual", type: KpiCalculationType.HIGHER_BETTER, unit: "Count", weight: 20, penalty: 0 },
        { categoryId: category.id, name: "Impresi", type: KpiCalculationType.HIGHER_BETTER, unit: "Count", weight: 20, penalty: 0 },
        { categoryId: category.id, name: "CPM", type: KpiCalculationType.LOWER_BETTER, unit: "Currency", weight: 15, penalty: 0 },
      ],
    });
    console.log(`  ✅ KPI Template: ${template.name}`);
  } else {
    console.log(`  ⏭️  KPI Template: 'Template KPI Marketing Q1 2026' already exists, skip`);
  }

  // 7. Create KPI Period
  const existingPeriod = await prisma.kpiPeriod.findFirst({
    where: { name: "Februari 2026" },
  });
  if (!existingPeriod) {
    await prisma.kpiPeriod.create({
      data: {
        name: "Februari 2026",
        startDate: new Date("2026-02-01"),
        endDate: new Date("2026-02-28"),
        status: "ACTIVE",
      },
    });
    console.log(`  ✅ KPI Period: Februari 2026`);
  } else {
    console.log(`  ⏭️  KPI Period: 'Februari 2026' already exists, skip`);
  }

  console.log("\n🎉 Seed completed successfully!");
  console.log("\n📊 Summary:");
  console.log(`   • 6 roles`);
  console.log(`   • ${permissions.length} permissions`);
  console.log(`   • 1 admin user (admin@perusahaan.com / admin123)`);
  console.log(`   • ${MOCK_EMPLOYEES.length} employees (8 active, 2 soft-deleted)`);
  console.log(`   • ${LEAVE_SAMPLES.length} leave requests`);
  console.log(`   • 1 KPI template + 1 period\n`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
