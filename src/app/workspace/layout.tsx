import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Header } from "@/components/workspace/header";
import { NavSidebar } from "@/components/workspace/nav-sidebar";

export default function WorkspaceLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex h-screen w-screen flex-col">
      <Header className="shrink-0" />
      <SidebarProvider
        className="flex min-h-0 grow"
        defaultOpen={false}
        style={
          {
            "--sidebar-width-icon": "calc(var(--spacing) * 15)",
          } as React.CSSProperties
        }
      >
        <NavSidebar />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </div>
  );
}
