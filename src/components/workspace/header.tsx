import { cn } from "@/lib/utils";

import { NavBreadcrumb } from "./nav-breadcrumb";

export function Header({ className }: { className?: string }) {
  return (
    <header className={cn("flex h-12 w-full items-center pl-14", className)}>
      <NavBreadcrumb />
    </header>
  );
}
