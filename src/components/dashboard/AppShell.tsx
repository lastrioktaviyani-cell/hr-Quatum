import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function AppShell({
  title,
  currentPath = "/",
  children,
}: {
  title: string;
  currentPath?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar currentPath={currentPath} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar title={title} />
        <main className="flex-1 px-6 py-6 lg:px-8 lg:py-7">{children}</main>
      </div>
    </div>
  );
}
