"use client";

import { GalleryHorizontalEnd, Settings } from "lucide-react";
import Link from "next/link";
import { useCallback, useState } from "react";

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { usePageName, useProjectId } from "@/hooks/page-hooks";
import { cn } from "@/lib/utils";

import { EditProjectDialog } from "./edit-project-dialog";

const MENU_ITEMS = [
  {
    name: "gallery",
    displayName: "Gallery",
    href: "./gallery",
    icon: <GalleryHorizontalEnd />,
  },
];

export function NavSidebarMenu() {
  const projectId = useProjectId();
  const pageName = usePageName();
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const handleSettingsClick = useCallback(() => {
    setProjectDialogOpen(true);
  }, []);
  return (
    <>
      <EditProjectDialog
        mode="edit"
        open={projectDialogOpen}
        projectId={projectId}
        onOpenChange={setProjectDialogOpen}
      />
      <SidebarMenu className="w-full">
        {MENU_ITEMS.map((item) => (
          <SidebarMenuItem key={item.href} className="size-15 px-0.5">
            <SidebarMenuButton asChild>
              <Link
                href={item.href}
                className={cn(
                  "flex min-h-14 min-w-14 flex-col items-center justify-center opacity-50",
                  pageName === item.name
                    ? "opacity-100 hover:opacity-100"
                    : "opacity-40 hover:opacity-85",
                )}
              >
                {item.icon}
                <div className="text-[10px]">{item.displayName}</div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <div
              className={cn(
                "flex min-h-14 min-w-14 flex-col items-center justify-center opacity-50",
                "opacity-40 hover:opacity-85",
                "cursor-pointer",
              )}
              onClick={handleSettingsClick}
            >
              <Settings />
              <div className="text-[10px]">Settings</div>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </>
  );
}
