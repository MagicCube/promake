"use client";

import { useParams, usePathname } from "next/navigation";
import { useMemo } from "react";

import { getPageNameFromPath } from "@/client/utils/page";

export function usePageName() {
  const pathname = usePathname();
  const pageName = useMemo(() => {
    return getPageNameFromPath(pathname);
  }, [pathname]);
  return pageName;
}

export function useProjectId() {
  const { projectId } = useParams<{ projectId?: string }>();
  return projectId;
}
