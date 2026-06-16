import { PrismaClient, KpiCalculationType } from "@prisma/client";
import bcryptjs from "bcryptjs";

const prisma = new PrismaClient();

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

  // 4. Create sample Employee
  const employee = await prisma.employee.upsert({
    where: { employeeNumber: "2209015" },
    update: {},
    create: {
      employeeNumber: "2209015",
      fullName: "Thoriq Al Ghifari",
      gender: "MALE",
      email: "thoriq@perusahaan.com",
      employmentStatus: "PERMANENT",
      joinDate: new Date("2022-09-02"),
    },
  });

  // Link admin to employee
  await prisma.user.update({
    where: { id: admin.id },
    data: { employeeId: employee.id },
  });
  console.log(`  ✅ Employee: ${employee.fullName} (linked to admin)`);

  // 5. Create sample KPI Template
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
      { categoryId: category.id, name: "Cost Acquisition Iklan", type: "LOWER_BETTER", unit: "Percentage", weight: 25, penalty: 0 },
      { categoryId: category.id, name: "Cost Per Lead", type: "LOWER_BETTER", unit: "Currency", weight: 20, penalty: 0 },
      { categoryId: category.id, name: "Botol Terjual", type: "HIGHER_BETTER", unit: "Count", weight: 20, penalty: 0 },
      { categoryId: category.id, name: "Impresi", type: "HIGHER_BETTER", unit: "Count", weight: 20, penalty: 0 },
      { categoryId: category.id, name: "CPM", type: "LOWER_BETTER", unit: "Currency", weight: 15, penalty: 0 },
    ],
  });
  console.log(`  ✅ KPI Template: ${template.name}`);

  // 6. Create KPI Period
  await prisma.kpiPeriod.create({
    data: {
      name: "Februari 2026",
      startDate: new Date("2026-02-01"),
      endDate: new Date("2026-02-28"),
      status: "ACTIVE",
    },
  });
  console.log(`  ✅ KPI Period: Februari 2026`);

  console.log("\n🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
