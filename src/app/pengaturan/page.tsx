import { AppShell } from "@/components/dashboard/AppShell";
import { SettingsHub } from "@/components/dashboard/SettingsHub";
import { ACCOUNT_CREATOR_ROLE_IDS, ROLES, SETTINGS } from "@/lib/mock-data";

export const metadata = { title: "Pengaturan" };

export default function PengaturanPage() {
  return (
    <AppShell title="Pengaturan" currentPath="/pengaturan">
      <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-6">
        <SettingsHub roles={ROLES} settings={SETTINGS} allowedRoleIds={ACCOUNT_CREATOR_ROLE_IDS} />
      </div>
    </AppShell>
  );
}
