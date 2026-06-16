import { AppShell } from "@/components/dashboard/AppShell";
import { AttendanceImport } from "@/components/dashboard/AttendanceImport";

export const metadata = { title: "Absensi" };

export default function AbsensiPage() {
  return (
    <AppShell title="Absensi" currentPath="/absensi">
      <AttendanceImport />
    </AppShell>
  );
}
