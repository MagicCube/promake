import { existsSync } from "fs";
import { mkdir, readdir, readFile, rm, writeFile } from "fs/promises";
import path from "path";

import type { Project } from "@/core/types";

export function getProjectFolderPath(projectId: string) {
  const projectPath = path.join("public/data/projects", projectId);
  return projectPath;
}

export function getProjectFilePath(projectId: string) {
  const projectPath = path.join("public/data/projects", projectId);
  const projectFilePath = path.join(projectPath, "project.json");
  return projectFilePath;
}

export async function listProjects() {
  const projectPath = path.join("public/data/projects");
  const fileOrFolders = await readdir(projectPath, { withFileTypes: true });
  const projects = await Promise.all(
    fileOrFolders
      .filter((fileOrFolder) => fileOrFolder.isDirectory())
      .map((folder) => getProject({ projectId: folder.name })),
  );
  return projects;
}

export async function getProject({ projectId }: { projectId: string }) {
  const projectFilePath = getProjectFilePath(projectId);
  const projectFileContent = await readFile(projectFilePath, "utf-8");
  const project = JSON.parse(projectFileContent) as Project;
  return project;
}

export async function createProject({
  projectId,
  data,
}: {
  projectId: string;
  data: Omit<Project, "id">;
}) {
  const projectFolderPath = getProjectFolderPath(projectId);
  if (existsSync(projectFolderPath)) {
    throw new Error("Project already exists");
  }
  await mkdir(projectFolderPath, { recursive: true });
  const projectFilePath = getProjectFilePath(projectId);
  const project = { ...data, id: projectId };
  await writeFile(projectFilePath, JSON.stringify(project, null, 2));
  return project;
}

export async function updateProject({
  projectId,
  data,
}: {
  projectId: string;
  data: Partial<Project>;
}) {
  const project = await getProject({ projectId });
  Object.assign(project, data);
  const projectFilePath = getProjectFilePath(projectId);
  await writeFile(projectFilePath, JSON.stringify(project, null, 2));
  return project;
}

export async function deleteProject({ projectId }: { projectId: string }) {
  const projectFolderPath = getProjectFolderPath(projectId);
  if (existsSync(projectFolderPath)) {
    await rm(projectFolderPath, { recursive: true });
  }
}
