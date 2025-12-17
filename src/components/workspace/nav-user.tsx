import type { User } from "better-auth";
import { BadgeCheck, ChevronsUpDown, LogOut } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { auth } from "@/server/better-auth";
import { getSession } from "@/server/better-auth/server";

export async function NavUser() {
  const session = await getSession();
  const user = session?.user;
  if (!user) {
    return null;
  }
  return (
    <SidebarMenu className="w-fit">
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex w-full items-center gap-2">
                <UserInfo compact user={user} />
                <ChevronsUpDown className="ml-auto size-4" />
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center px-1 py-1.5">
                <UserInfo user={user} />
              </div>
            </DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <form className="w-full">
                <button
                  className="flex w-full items-center gap-2 text-left"
                  type="submit"
                  formAction={async () => {
                    "use server";
                    await auth.api.signOut({
                      headers: await headers(),
                    });
                    redirect("/");
                  }}
                >
                  <LogOut />
                  Sign out
                </button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function UserInfo({ user, compact }: { user: User; compact?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <Avatar className="h-8 w-8 rounded-full">
        {user.image && <AvatarImage src={user.image} alt={user.name} />}
        <AvatarFallback className="rounded-lg">{user.name}</AvatarFallback>
      </Avatar>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-medium">{user.name}</span>
        {!compact && (
          <span className="text-muted-foreground truncate text-xs">
            {user.email}
          </span>
        )}
      </div>
    </div>
  );
}
