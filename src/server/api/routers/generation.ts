import fs from "fs/promises";
import path from "path";

import z from "zod";

import { Generation, GenerationInput, GenerationOutput } from "@/core/types";
import {
  createGeneration,
  deleteGeneration,
  setDefaultOutput,
  updateGeneration,
  updateGenerationOutput,
} from "@/server/biz-logic/generation";
import { getProjectFolderPath } from "@/server/biz-logic/project";
import { convertToDataURL } from "@/server/utils/data-url";

import { createTRPCRouter, protectedProcedure } from "../../api/trpc";
import { createGenerationProvider } from "../../providers";

export const router = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        generationId: z.string(),
        data: Generation.omit({ id: true }),
      }),
    )
    .mutation(async ({ input }) => {
      return await createGeneration(input);
    }),
  update: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        generationId: z.string(),
        data: Generation.partial().omit({ id: true }),
      }),
    )
    .mutation(async ({ input }) => {
      await updateGeneration(input);
    }),
  updateOutput: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        generationId: z.string(),
        outputId: z.string(),
        data: GenerationOutput,
      }),
    )
    .mutation(async ({ input }) => {
      await updateGenerationOutput(input);
    }),
  delete: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        generationId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      await deleteGeneration(input);
    }),
  setDefaultOutput: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        generationId: z.string(),
        outputId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      await setDefaultOutput(input);
    }),
  generate: protectedProcedure
    .input(
      z.object({
        input: GenerationInput,
        projectId: z.string(),
        generationId: z.string(),
        outputId: z.string(),
      }),
    )
    .output(GenerationOutput)
    .mutation(
      async ({ input: { input, projectId, generationId, outputId } }) => {
        const filePath = path.join(projectId, generationId);
        let filename = outputId;
        console.info(`Generating ${filePath}/${filename}`);
        const provider = createGenerationProvider(input.provider);
        if (input.referenceImageURLs) {
          let refIndex = 0;
          for (const url of input.referenceImageURLs) {
            const filePath = path.join(
              getProjectFolderPath(projectId),
              generationId,
              "refs",
              url,
            );
            const dataURL = await convertToDataURL(filePath);
            input.referenceImageURLs[refIndex] = dataURL;
            refIndex++;
          }
        }
        try {
          if (!provider.generate) {
            throw new Error(
              `Provider ${provider.name} does not support single generate`,
            );
          }
          const res = await provider.generate(input);
          const { buffer, mimeType } = res;
          switch (mimeType) {
            case "image/png":
              filename += ".png";
              break;
            case "image/jpeg":
              filename += ".jpg";
              break;
            default:
              console.warn(`Unsupported mime type: ${mimeType}`);
              filename += ".bin";
              break;
          }
          const fullPath = path.join(
            "public/data/projects",
            filePath,
            filename,
          );
          await fs.writeFile(fullPath, buffer);
          console.info("Saved to " + fullPath);
          return {
            id: outputId,
            url: filename,
            state: "completed",
            mimeType: mimeType,
          };
        } catch (error) {
          console.error(`Failed to generate image ${filePath}`);
          return {
            id: outputId,
            state: "error",
            error: (error as Error).message,
          };
        }
      },
    ),
  batchGenerate: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        generationId: z.string(),
        input: GenerationInput,
        batchSize: z.number(),
      }),
    )
    .mutation(
      async ({ input: { input, projectId, generationId, batchSize } }) => {
        const provider = createGenerationProvider(input.provider);
        if (!provider.batchGenerate) {
          throw new Error(
            `Provider ${provider.name} does not support batch generate`,
          );
        }
        if (input.referenceImageURLs) {
          let refIndex = 0;
          for (const url of input.referenceImageURLs) {
            const filePath = path.join(
              getProjectFolderPath(projectId),
              generationId,
              "refs",
              url,
            );
            const dataURL = await convertToDataURL(filePath);
            input.referenceImageURLs[refIndex] = dataURL;
            refIndex++;
          }
        }
        const outputs = await provider.batchGenerate(input, batchSize);
        return outputs.map((output) => {
          const id = /imgs\/\d{8}\/(\w+)\.jpg/.exec(output.url)![1]!;
          return {
            id,
            url: output.url,
            state: "completed",
            mimeType: output.mimeType,
          };
        });
      },
    ),
});
