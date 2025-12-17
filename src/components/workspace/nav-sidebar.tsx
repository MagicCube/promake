import Image from "next/image";

import { cn } from "@/lib/utils";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "../ui/sidebar";

import { NavSidebarMenu } from "./nav-sidebar-menu";
import { NavUser } from "./nav-user";

export function NavSidebar({
  className,
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      className={cn("border-none", className)}
      collapsible="icon"
      {...props}
    >
      <SidebarHeader>
        <div className="flex h-10 w-full -translate-y-1 items-center justify-center">
          <Image
            src="/images/logo.png"
            alt="Animake Logo"
            width={20}
            height={20}
          />
        </div>
      </SidebarHeader>
      <SidebarContent className="items-center">
        <NavSidebarMenu />
      </SidebarContent>
      <SidebarFooter className="flex items-center justify-center">
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
