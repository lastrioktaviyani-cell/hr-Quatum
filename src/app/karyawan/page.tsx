import { AppShell } from "@/components/dashboard/AppShell";
import { EmployeeTable } from "@/components/dashboard/EmployeeTable";
import { EMPLOYEES } from "@/lib/mock-data";

export const metadata = { title: "Karyawan" };

export default function KaryawanPage() {
  return (
    <AppShell title="Karyawan" currentPath="/karyawan">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <EmployeeTable data={EMPLOYEES} />
      </div>
    </AppShell>
  );
}
