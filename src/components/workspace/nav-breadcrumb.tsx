"use client";

import { ChevronsUpDown, Plus } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import {
  useProjectListQuery,
  useProjectQuery,
} from "@/client/biz-logic/project";
import { capitalizeFirstLetter } from "@/core/utils/text";
import { usePageName, useProjectId } from "@/hooks/page-hooks";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import { EditProjectDialog } from "./edit-project-dialog";

export function NavBreadcrumb() {
  const projectId = useProjectId();
  const { data: project } = useProjectQuery({ projectId });
  const { data: projects } = useProjectListQuery();
  const pageName = usePageName();
  const projectDisplayName = useMemo(() => {
    let name = projectId;
    if (project?.name) {
      name = project.name;
    }
    return name;
  }, [projectId, project]);
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  return (
    <>
      <EditProjectDialog
        mode="create"
        open={projectDialogOpen}
        onOpenChange={setProjectDialogOpen}
      />
      <Breadcrumb>
        <BreadcrumbList className="gap-1!">
          <BreadcrumbSeparator className="opacity-25">/</BreadcrumbSeparator>
          <BreadcrumbItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="hover:bg-accent h-8 gap-2 px-2!"
                >
                  {projectDisplayName}
                  <ChevronsUpDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {projects?.map((project) => (
                  <DropdownMenuItem key={project.id}>
                    <Link
                      className="flex w-full"
                      href={`/workspace/projects/${project.id}/gallery`}
                    >
                      <div className="flex h-9 w-60 items-center gap-4">
                        <div className="flex w-8 items-center justify-center">
                          <div className="size-8 overflow-hidden rounded-md">
                            <img
                              alt=""
                              src={
                                project.thumbnail ??
                                "/images/default-avatar.svg"
                              }
                              className="size-full object-cover"
                            />
                          </div>
                        </div>
                        <div>{project.name}</div>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  key="create"
                  className="text-primary!"
                  onSelect={() => setProjectDialogOpen(true)}
                >
                  <div className="flex h-9 w-60 items-center gap-4">
                    <div className="flex w-8 items-center justify-center">
                      <Plus className="text-primary size-6" />
                    </div>
                    <div>New project</div>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="opacity-25">/</BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage className="px-2">
              {pageName && capitalizeFirstLetter(pageName)}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </>
  );
}
