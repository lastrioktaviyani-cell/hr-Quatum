import type { LucideIcon } from "lucide-react";
import {
  Archive,
  CalendarCheck,
  ChartNoAxesCombined,
  ClipboardCheck,
  Clock,
  LayoutDashboard,
  Settings,
  Users,
} from "lucide-react";

export type NavItem = {
  readonly href: string;
  readonly label: string;
  readonly icon: LucideIcon;
};

export const SIDEBAR_ITEMS: readonly NavItem[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/karyawan", label: "Karyawan", icon: Users },
  { href: "/absensi", label: "Absensi", icon: Clock },
  { href: "/kpi", label: "KPI Management", icon: ChartNoAxesCombined },
  { href: "/izin-cuti", label: "Izin & Cuti", icon: CalendarCheck },
  { href: "/pengaturan", label: "Pengaturan", icon: Settings },
] as const;

export type Stat = {
  readonly label: string;
  readonly value: string;
  readonly sub: string;
  readonly icon: string;
  readonly tone: "violet" | "blue" | "emerald" | "amber" | "rose" | "slate";
};

export const DASHBOARD_STATS: readonly Stat[] = [
  { label: "Total Karyawan", value: "100", sub: "Karyawan terdaftar", icon: "👥", tone: "violet" },
  { label: "Karyawan Aktif", value: "98", sub: "Status aktif saat ini", icon: "🟢", tone: "emerald" },
  { label: "Izin/Cuti Aktif", value: "18", sub: "4 menunggu approval", icon: "🏖️", tone: "amber" },
  { label: "Dokumen Arsip", value: "1.284", sub: "87 dokumen bulan ini", icon: "🗂️", tone: "blue" },
] as const;

export type ChartPoint = {
  readonly label: string;
  readonly value: number;
  readonly value2?: number;
};

export const EMPLOYEE_GROWTH: readonly ChartPoint[] = [
  { label: "Des", value: 230 },
  { label: "Jan", value: 236 },
  { label: "Feb", value: 240 },
  { label: "Mar", value: 248 },
  { label: "Apr", value: 252 },
  { label: "Mei", value: 256 },
] as const;

export const YEARLY_EMPLOYEE_GROWTH: readonly ChartPoint[] = [
  { label: "2020", value: 120 },
  { label: "2021", value: 145 },
  { label: "2022", value: 178 },
  { label: "2023", value: 210 },
  { label: "2024", value: 236 },
  { label: "2025", value: 248 },
  { label: "2026", value: 256 },
] as const;

export const LEAVE_TREND: readonly ChartPoint[] = [
  { label: "Jan", value: 5 },
  { label: "Feb", value: 8 },
  { label: "Mar", value: 10 },
  { label: "Apr", value: 15 },
  { label: "Mei", value: 9 },
  { label: "Jun", value: 17 },
] as const;

export const YEARLY_ABSENCE: readonly ChartPoint[] = [
  { label: "Jan", value: 32, value2: 10 },
  { label: "Feb", value: 28, value2: 12 },
  { label: "Mar", value: 35, value2: 10 },
  { label: "Apr", value: 40, value2: 14 },
  { label: "Mei", value: 30, value2: 10 },
  { label: "Jun", value: 26, value2: 8 },
  { label: "Jul", value: 38, value2: 10 },
  { label: "Agu", value: 42, value2: 11 },
  { label: "Sep", value: 36, value2: 9 },
  { label: "Okt", value: 33, value2: 10 },
  { label: "Nov", value: 29, value2: 8 },
  { label: "Des", value: 31, value2: 7 },
] as const;

export type MonthlyEmployee = {
  readonly month: string;
  readonly total: number;
  readonly active: number;
  readonly leave: number;
  readonly late: number;
};

export const MONTHLY_EMPLOYEES: readonly MonthlyEmployee[] = [
  { month: "Jan 2024", total: 248, active: 232, leave: 8, late: 10 },
  { month: "Feb 2024", total: 248, active: 235, leave: 5, late: 12 },
  { month: "Mar 2024", total: 250, active: 238, leave: 6, late: 10 },
  { month: "Apr 2024", total: 252, active: 240, leave: 4, late: 14 },
  { month: "Mei 2024", total: 256, active: 242, leave: 10, late: 10 },
  { month: "Jun 2024", total: 256, active: 244, leave: 6, late: 8 },
] as const;

export type KeyAbsence = {
  readonly label: string;
  readonly value: string;
  readonly icon: string;
  readonly tone: "blue" | "emerald" | "amber" | "rose";
};

export const KEY_ABSENCES: readonly KeyAbsence[] = [
  { label: "Sakit", value: "18", icon: "🏥", tone: "rose" },
  { label: "WFH", value: "35", icon: "🏠", tone: "emerald" },
  { label: "Cuti Tahunan", value: "26", icon: "🏖️", tone: "amber" },
] as const;

export const LAST_10_LATE: readonly { readonly date: string; readonly count: number }[] = [
  { date: "05 Mei", count: 3 },
  { date: "08 Mei", count: 5 },
  { date: "09 Mei", count: 2 },
  { date: "11 Mei", count: 7 },
  { date: "13 Mei", count: 4 },
  { date: "14 Mei", count: 6 },
  { date: "15 Mei", count: 3 },
  { date: "17 Mei", count: 8 },
  { date: "19 Mei", count: 2 },
  { date: "20 Mei", count: 5 },
] as const;

export const ANALYTICS_TREND: readonly ChartPoint[] = [
  { label: "Jan", value: 84, value2: 62 },
  { label: "Feb", value: 88, value2: 66 },
  { label: "Mar", value: 79, value2: 70 },
  { label: "Apr", value: 92, value2: 74 },
  { label: "Mei", value: 89, value2: 80 },
  { label: "Jun", value: 94, value2: 86 },
] as const;

export type Segment = {
  readonly name: string;
  readonly value: number;
  readonly pct: number;
  readonly color: string;
};

export const EMPLOYEE_SEGMENTS: readonly Segment[] = [
  { name: "Manajemen", value: 18, pct: 7, color: "#1e40af" },
  { name: "Staff", value: 150, pct: 59, color: "#22c55e" },
  { name: "Operator", value: 60, pct: 23, color: "#f59e0b" },
  { name: "Lainnya", value: 28, pct: 11, color: "#ef4444" },
] as const;

export const LEAVE_SEGMENTS: readonly Segment[] = [
  { name: "Cuti Tahunan", value: 6, pct: 50, color: "#1e40af" },
  { name: "Izin", value: 4, pct: 33, color: "#22c55e" },
  { name: "Cuti Sakit", value: 2, pct: 17, color: "#f59e0b" },
] as const;

export type Performance = {
  readonly id: string;
  readonly name: string;
  readonly dept: string;
  readonly role: string;
  readonly score: number;
  readonly grade: string;
  readonly status: string;
  readonly avatar: string;
};

export const PERFORMANCE_ROWS: readonly Performance[] = [
  { id: "p1", name: "Thoriq Al Ghifari", dept: "HC & GA", role: "General Affair", score: 92, grade: "Sangat Baik", status: "Selesai", avatar: "#8b5cf6" },
  { id: "p2", name: "Naura Salsabila", dept: "Bussines Development", role: "Sales & Partnership B2B", score: 88, grade: "Sangat Baik", status: "Selesai", avatar: "#14b8a6" },
  { id: "p3", name: "Syafal Qothi", dept: "Marketing", role: "TikTok dan New Chanel", score: 76, grade: "Baik", status: "Selesai", avatar: "#3b82f6" },
  { id: "p4", name: "Rika Rahman", dept: "HC & GA", role: "Corporate Secreatry", score: 85, grade: "Sangat Baik", status: "Selesai", avatar: "#ef4444" },
] as const;

export type EmploymentType =
  | "PKWTT"
  | "PKWT"
  | "Probation"
  | "Harian Lepas"
  | "Part-Time"
  | "Freelancer"
  | "Outsourcing"
  | "Internship";

export const EMPLOYMENT_LABELS: Record<EmploymentType, string> = {
  PKWTT: "Karyawan Tetap",
  PKWT: "Karyawan Kontrak",
  Probation: "Masa Percobaan",
  "Harian Lepas": "Harian Lepas",
  "Part-Time": "Paruh Waktu",
  Freelancer: "Freelancer",
  Outsourcing: "Alih Daya",
  Internship: "Magang",
};

export const EMPLOYMENT_STYLE: Record<EmploymentType, string> = {
  PKWTT: "bg-emerald-50 text-emerald-700",
  PKWT: "bg-blue-50 text-blue-700",
  Probation: "bg-amber-50 text-amber-700",
  "Harian Lepas": "bg-slate-100 text-slate-600",
  "Part-Time": "bg-purple-50 text-purple-700",
  Freelancer: "bg-pink-50 text-pink-700",
  Outsourcing: "bg-orange-50 text-orange-700",
  Internship: "bg-cyan-50 text-cyan-700",
};

export type EmployeeRow = {
  readonly id: string;
  readonly nip: string;
  readonly name: string;
  readonly gender: "Male" | "Female";
  readonly position: string;
  readonly department: string;
  readonly dateOfJoin: string;
  readonly endDate: string;
  readonly status: EmploymentType;
  readonly isActive: boolean;
  readonly avatar: string;
};

export const EMPLOYEES: readonly EmployeeRow[] = [
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
] as const;

export type DocumentStatus = "Aktif" | "Draft" | "Review";

export type DocumentRow = {
  readonly id: string;
  readonly title: string;
  readonly category: string;
  readonly type: "PDF" | "DOCX" | "XLSX";
  readonly size: string;
  readonly owner: string;
  readonly department: string;
  readonly date: string;
  readonly status: DocumentStatus;
  readonly description: string;
  readonly tone: "red" | "blue" | "green" | "purple";
};

export const DOCUMENTS: readonly DocumentRow[] = [
  { id: "d1", title: "Kebijakan Cuti Karyawan", category: "Kebijakan", type: "PDF", size: "1.2 MB", owner: "Admin HRD", department: "HC & GA", date: "20 Mei 2024", status: "Aktif", description: "Pedoman cuti tahunan, izin pribadi, dan cuti sakit untuk seluruh karyawan.", tone: "red" },
  { id: "d2", title: "Peraturan Perusahaan", category: "Legal", type: "DOCX", size: "2.4 MB", owner: "Admin HRD", department: "Legal", date: "18 Mei 2024", status: "Review", description: "Dokumen aturan perusahaan yang sedang direview untuk pembaruan tahunan.", tone: "blue" },
  { id: "d3", title: "Data Karyawan Mei 2024", category: "Master Data", type: "XLSX", size: "18.7 KB", owner: "Sistem", department: "HC & GA", date: "17 Mei 2024", status: "Aktif", description: "Snapshot master data karyawan aktif, kontrak, dan status employment bulan Mei.", tone: "green" },
  { id: "d4", title: "Panduan Penilaian Kinerja", category: "Performance", type: "PDF", size: "1.8 MB", owner: "HR Manager", department: "HC & GA", date: "16 Mei 2024", status: "Aktif", description: "Panduan scoring dan kalibrasi penilaian kerja untuk manager dan supervisor.", tone: "purple" },
  { id: "d5", title: "Template Surat Peringatan", category: "Legal", type: "DOCX", size: "780 KB", owner: "HR Legal", department: "Legal", date: "14 Mei 2024", status: "Aktif", description: "Template SP1, SP2, dan SP3 sesuai format legal perusahaan.", tone: "blue" },
  { id: "d6", title: "Rekap Absensi Q2", category: "Master Data", type: "XLSX", size: "42.3 KB", owner: "Sistem", department: "Operations", date: "12 Mei 2024", status: "Draft", description: "Rekap absensi kuartal berjalan untuk review kedisiplinan tim.", tone: "green" },
  { id: "d7", title: "SOP Onboarding Karyawan", category: "Kebijakan", type: "PDF", size: "980 KB", owner: "HR Generalist", department: "HC & GA", date: "10 Mei 2024", status: "Aktif", description: "Alur onboarding, checklist dokumen, dan pengenalan sistem untuk karyawan baru.", tone: "red" },
] as const;

export type LeaveRequest = {
  readonly id: string;
  readonly name: string;
  readonly nip: string;
  readonly department: string;
  readonly type: string;
  readonly startDate: string;
  readonly endDate: string;
  readonly duration: string;
  readonly reason: string;
  readonly status: "Menunggu" | "Disetujui" | "Ditolak";
  readonly avatar: string;
  readonly document: string;
  readonly rejectReason?: string;
};

export const LEAVE_REQUESTS: readonly LeaveRequest[] = [
  { id: "lr1", name: "Thoriq Al Ghifari", nip: "2209015", department: "HC & GA", type: "Cuti Tahunan", startDate: "1 Mei 2024", endDate: "3 Mei 2024", duration: "3 Hari", reason: "Acara keluarga di luar kota", status: "Menunggu", avatar: "#8b5cf6", document: "Surat_Keterangan.pdf" },
  { id: "lr2", name: "Bella Intan Yunita", nip: "2301020", department: "HC & GA", type: "Izin", startDate: "5 Mei 2024", endDate: "5 Mei 2024", duration: "1 Hari", reason: "Keperluan pribadi", status: "Disetujui", avatar: "#a855f7", document: "" },
  { id: "lr3", name: "Rika Rahman", nip: "2110004", department: "HC & GA", type: "Cuti Sakit", startDate: "7 Mei 2024", endDate: "8 Mei 2024", duration: "2 Hari", reason: "Sakit demam tinggi", status: "Ditolak", avatar: "#ef4444", document: "Surat_Sakit.pdf", rejectReason: "Tidak ada surat keterangan dokter yang dilampirkan." },
  { id: "lr4", name: "Naura Salsabila", nip: "2500675", department: "Bussines Development", type: "Cuti Tahunan", startDate: "20 Mei 2024", endDate: "23 Mei 2024", duration: "4 Hari", reason: "Liburan ke Bali", status: "Menunggu", avatar: "#14b8a6", document: "Bukti_Booking.pdf" },
] as const;

export type RolePermissionKey =
  | "dashboard"
  | "employees"
  | "attendance"
  | "documents"
  | "performance"
  | "kpi"
  | "leave"
  | "analytics"
  | "settings";

export type RoleId = "super-admin" | "admin" | "hr" | "manager" | "supervisor" | "staff";

export type RoleRow = {
  readonly id: RoleId;
  readonly name: string;
  readonly description: string;
  readonly users: number;
  readonly isActive: boolean;
  readonly tone: "violet" | "blue" | "emerald" | "amber" | "rose" | "slate";
  readonly permissions: readonly RolePermissionKey[];
};

export const ROLE_PERMISSIONS: Record<RolePermissionKey, string> = {
  dashboard: "Dashboard",
  employees: "Karyawan",
  attendance: "Absensi",
  documents: "Dokumen",
  performance: "Penilaian",
  kpi: "KPI",
  leave: "Izin & Cuti",
  analytics: "Analytics",
  settings: "Pengaturan",
};

export const ACCOUNT_CREATOR_ROLE_IDS: readonly RoleId[] = ["super-admin", "admin", "hr"] as const;
export const DOCUMENT_ACCESS_ROLE_IDS: readonly RoleId[] = ["super-admin", "admin", "hr", "manager"] as const;

export const ROLES: readonly RoleRow[] = [
  {
    id: "super-admin",
    name: "Super Admin",
    description: "Akses penuh untuk konfigurasi sistem, role, audit, dan seluruh modul HRD.",
    users: 1,
    isActive: true,
    tone: "violet",
    permissions: ["dashboard", "employees", "attendance", "documents", "performance", "kpi", "leave", "analytics", "settings"],
  },
  {
    id: "admin",
    name: "Admin",
    description: "Mengelola operasional sistem, master data, dokumen, dan pengaturan umum.",
    users: 3,
    isActive: true,
    tone: "blue",
    permissions: ["dashboard", "employees", "attendance", "documents", "leave", "settings"],
  },
  {
    id: "hr",
    name: "HR",
    description: "Mengelola data karyawan, absensi, cuti, dokumen HR, dan laporan people ops.",
    users: 6,
    isActive: true,
    tone: "emerald",
    permissions: ["dashboard", "employees", "attendance", "documents", "leave", "analytics"],
  },
  {
    id: "manager",
    name: "Manager",
    description: "Melihat performa tim, menyetujui KPI, dan memantau analytics departemen.",
    users: 12,
    isActive: true,
    tone: "amber",
    permissions: ["dashboard", "performance", "kpi", "leave", "analytics"],
  },
  {
    id: "supervisor",
    name: "Supervisor",
    description: "Mengawasi anggota tim, input KPI, review absensi, dan rekomendasi approval.",
    users: 18,
    isActive: true,
    tone: "rose",
    permissions: ["dashboard", "attendance", "performance", "kpi", "leave"],
  },
  {
    id: "staff",
    name: "Staff",
    description: "Akses mandiri untuk melihat data pribadi, pengajuan cuti, dan pencapaian KPI.",
    users: 216,
    isActive: true,
    tone: "slate",
    permissions: ["dashboard", "documents", "kpi", "leave"],
  },
] as const;

export type AccountStatus = "Aktif" | "Nonaktif";

export type AccountRow = {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly roleId: RoleId;
  readonly department: string;
  readonly status: AccountStatus;
  readonly lastLogin: string;
};

export const ACCOUNT_ROWS: readonly AccountRow[] = [
  { id: "acc-1", name: "Ahkmad Prasetia", email: "superadmin@perusahaan.com", roleId: "super-admin", department: "Management", status: "Aktif", lastLogin: "Hari ini" },
  { id: "acc-2", name: "Bella Intan Yunita", email: "bella@perusahaan.com", roleId: "hr", department: "HC & GA", status: "Aktif", lastLogin: "Kemarin" },
  { id: "acc-3", name: "Naura Salsabila", email: "naura@perusahaan.com", roleId: "manager", department: "Business Development", status: "Aktif", lastLogin: "2 hari lalu" },
  { id: "acc-4", name: "Rika Rahman", email: "rika@perusahaan.com", roleId: "admin", department: "HC & GA", status: "Aktif", lastLogin: "Minggu lalu" },
  { id: "acc-5", name: "Syafal Qothi", email: "syafal@perusahaan.com", roleId: "staff", department: "Marketing", status: "Nonaktif", lastLogin: "30 hari lalu" },
] as const;

export type SettingRow = {
  readonly label: string;
  readonly description: string;
  readonly enabled: boolean;
  readonly icon: string;
};

export const SETTINGS: readonly SettingRow[] = [
  { label: "Notifikasi approval", description: "Kirim pemberitahuan saat pengajuan cuti baru masuk.", enabled: true, icon: "🔔" },
  { label: "Backup arsip otomatis", description: "Sinkronisasi dokumen ke penyimpanan terjadwal.", enabled: true, icon: "🗄️" },
  { label: "Mode audit", description: "Catat perubahan data sensitif untuk compliance.", enabled: false, icon: "🛡️" },
] as const;

// --- KPI DATA ---

export type KpiDataRow = {
  readonly id: string;
  readonly nip: string;
  readonly name: string;
  readonly department: string;
  readonly position: string;
  readonly period: string;
  readonly kpiScore: number;
  readonly penaltyScore: number;
  readonly finalScore: number;
  readonly predicate: "SANGAT BAIK" | "BAIK" | "CUKUP" | "KURANG" | "SANGAT KURANG";
  readonly status: "Selesai" | "Draft" | "Review";
};

export const KPI_DATA: readonly KpiDataRow[] = [
  { id: "kpi-1", nip: "2209015", name: "Thoriq Al Ghifari", department: "HC & GA", position: "General Affair", period: "Februari 2026", kpiScore: 92, penaltyScore: 0, finalScore: 92, predicate: "SANGAT BAIK", status: "Selesai" },
  { id: "kpi-2", nip: "2500675", name: "Naura Salsabila", department: "Business Development", position: "Sales & Partnership B2B", period: "Februari 2026", kpiScore: 88, penaltyScore: 0, finalScore: 88, predicate: "SANGAT BAIK", status: "Selesai" },
  { id: "kpi-3", nip: "2110004", name: "Rika Rahman", department: "HC & GA", position: "Corporate Secretary", period: "Februari 2026", kpiScore: 85, penaltyScore: 0, finalScore: 85, predicate: "SANGAT BAIK", status: "Selesai" },
  { id: "kpi-4", nip: "2206011", name: "Syafal Qothi", department: "Marketing", position: "TikTok dan New Chanel", period: "Februari 2026", kpiScore: 78, penaltyScore: 2, finalScore: 76, predicate: "BAIK", status: "Selesai" },
  { id: "kpi-5", nip: "2401162", name: "Bibit Prasetiyo", department: "Upper Funnel", position: "Designer", period: "Februari 2026", kpiScore: 68, penaltyScore: 0, finalScore: 68, predicate: "CUKUP", status: "Review" },
  { id: "kpi-6", nip: "2301020", name: "Bella Intan Yunita", department: "HC & GA", position: "HC Generalist", period: "Februari 2026", kpiScore: 80, penaltyScore: 0, finalScore: 80, predicate: "BAIK", status: "Selesai" },
  { id: "kpi-7", nip: "2500165", name: "Amanda Ramadhan", department: "Marketing", position: "Advertiser TikTok", period: "Februari 2026", kpiScore: 64.9, penaltyScore: 0, finalScore: 64.9, predicate: "CUKUP", status: "Draft" },
];

export type RekapKpiDepartment = {
  readonly department: string;
  readonly averageScore: number;
  readonly totalEmployees: number;
  readonly highestScore: number;
  readonly lowestScore: number;
};

export const REKAP_KPI_DEPARTMENTS: readonly RekapKpiDepartment[] = [
  { department: "HC & GA", averageScore: 85.6, totalEmployees: 12, highestScore: 95, lowestScore: 72 },
  { department: "Marketing", averageScore: 78.4, totalEmployees: 18, highestScore: 92, lowestScore: 64 },
  { department: "Business Development", averageScore: 88.2, totalEmployees: 8, highestScore: 96, lowestScore: 81 },
  { department: "Upper Funnel", averageScore: 74.5, totalEmployees: 15, highestScore: 89, lowestScore: 58 },
  { department: "Operations", averageScore: 81.0, totalEmployees: 24, highestScore: 94, lowestScore: 68 },
];
