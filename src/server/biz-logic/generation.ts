import { mkdir, rmdir, writeFile } from "fs/promises";
import path from "path";

import type { Generation, GenerationOutput } from "@/core/types";

import { isDataURL, parseDataURL } from "../utils/data-url";

import { getProject, getProjectFolderPath, updateProject } from "./project";

export async function createGeneration({
  projectId,
  generationId,
  data,
}: {
  projectId: string;
  generationId: string;
  data: Omit<Generation, "id">;
}) {
  const project = await getProject({ projectId });
  const newGeneration: Generation = { ...data, id: generationId };
  const projectFolderPath = getProjectFolderPath(projectId);
  const generationFolderPath = path.join(projectFolderPath, generationId);
  await mkdir(generationFolderPath);
  if (newGeneration.input.referenceImageURLs?.length) {
    let refIndex = 0;
    for (const url of newGeneration.input.referenceImageURLs) {
      if (isDataURL(url)) {
        const { data, fileExtension } = parseDataURL(url);
        await mkdir(path.join(generationFolderPath, "refs"), {
          recursive: true,
        });
        const refFilename =
          (refIndex + 1).toString().padStart(2, "0") + fileExtension;
        await writeFile(
          path.join(generationFolderPath, "refs", refFilename),
          Buffer.from(data, "base64"),
        );
        newGeneration.input.referenceImageURLs[refIndex] = refFilename;
      }
      refIndex++;
    }
  }
  project.generations.unshift(newGeneration);
  await updateProject({ projectId, data: project });
  return newGeneration;
}

export async function deleteGeneration({
  projectId,
  generationId,
}: {
  projectId: string;
  generationId: string;
}) {
  const project = await getProject({ projectId });
  project.generations = project.generations.filter(
    (generation) => generation.id !== generationId,
  );
  await updateProject({ projectId, data: project });
  const projectFolderPath = getProjectFolderPath(projectId);
  await rmdir(path.join(projectFolderPath, generationId), { recursive: true });
}

export async function updateGeneration({
  projectId,
  generationId,
  data,
}: {
  projectId: string;
  generationId: string;
  data: Partial<Omit<Generation, "id">>;
}) {
  const project = await getProject({ projectId });
  const generation = project.generations.find(
    (generation) => generation.id === generationId,
  );
  if (!generation) {
    throw new Error("Generation not found");
  }
  Object.assign(generation, data);
  await updateProject({ projectId, data: project });
}

export async function updateGenerationOutput({
  projectId,
  generationId,
  outputId,
  data,
}: {
  projectId: string;
  generationId: string;
  outputId: string;
  data: Omit<GenerationOutput, "id">;
}) {
  const project = await getProject({ projectId });
  const generation = project.generations.find(
    (generation) => generation.id === generationId,
  );
  if (!generation) {
    throw new Error("Generation not found");
  }
  const output = generation.outputs.find((output) => output.id === outputId);
  if (!output) {
    throw new Error("Output not found");
  }
  Object.assign(output, data);
  await updateGeneration({ projectId, generationId, data: generation });
}

export async function setDefaultOutput({
  projectId,
  generationId,
  outputId,
}: {
  projectId: string;
  generationId: string;
  outputId: string;
}) {
  await updateGeneration({
    projectId,
    generationId,
    data: {
      defaultOutputId: outputId,
    },
  });
}
