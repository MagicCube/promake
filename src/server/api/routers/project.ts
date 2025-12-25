import fs from "fs";

import z from "zod";

import { Project } from "@/core/types";
import {
  createProject,
  deleteProject,
  getProject,
  getProjectFolderPath,
  listProjects,
  updateProject,
} from "@/server/biz-logic/project";

import { createTRPCRouter, protectedProcedure } from "../../api/trpc";

export const router = createTRPCRouter({
  get: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const project = await getProject(input);
      return project;
    }),
  create: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        data: Project.omit({ id: true }),
      }),
    )
    .mutation(async ({ input }) => {
      const project = await createProject(input);
      return project;
    }),
  verifyProjectId: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        verifyExists: z.boolean().optional().default(false),
      }),
    )
    .mutation(async ({ input }) => {
      const projectFolderPath = getProjectFolderPath(input.projectId);
      if (input.verifyExists && fs.existsSync(projectFolderPath)) {
        return {
          verified: false,
          exists: true,
          message: "Project already exists",
        };
      }
      if (!/^[a-z0-9_-]+$/.test(input.projectId)) {
        return {
          verified: false,
          exists: false,
          message:
            "Only lower-case letters, numbers, underscores, and hyphens are allowed",
        };
      }
      if (!/^[a-z]/.test(input.projectId)) {
        return {
          verified: false,
          exists: false,
          message: "Project ID must begin with a letter",
        };
      }
      return {
        verified: true,
      };
    }),
  update: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        data: Project.omit({ id: true }).partial(),
      }),
    )
    .mutation(async ({ input }) => {
      const project = await updateProject(input);
      return project;
    }),
  list: protectedProcedure.query(async () => {
    const projects = await listProjects();
    return projects.map((project) => {
      let thumbnail: string | undefined;
      if (project.generations.length) {
        const generation = project.generations[project.generations.length - 1]!;
        const output = generation.outputs[0]!;
        if (
          output.state === "completed" &&
          output.mimeType.startsWith("image/")
        ) {
          if (!output.url.startsWith("http")) {
            thumbnail = `/data/projects/${project.id}/${generation.id}/${output.url}`;
          } else {
            thumbnail = output.url;
          }
        }
      }
      return {
        id: project.id,
        name: project.name,
        thumbnail,
      } satisfies {
        id: string;
        name: string;
        thumbnail?: string;
      };
    });
  }),
  delete: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      await deleteProject(input);
    }),
});
