"use client";

import { useEffect } from "react";

import { appMetadata } from "@/app-metadata";
import { useProjectQuery } from "@/client/biz-logic/project";
import { useProjectId } from "@/hooks/page-hooks";

export default function WorkspaceProjectLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const projectId = useProjectId();
  const project = useProjectQuery({ projectId });
  useEffect(() => {
    if (project.data) {
      document.title = `${project.data.name} - ${appMetadata.title}`;
    } else {
      document.title = `${projectId} - ${appMetadata.title}`;
    }
  }, [project.data, projectId]);
  return children;
}
