import z from "zod";

import { AspectRatio } from "./aspect-ratio";
import { Resolution } from "./resolution";

export const GenerationInput = z.object({
  provider: z.string(),
  model: z.string(),
  prompt: z.string(),
  referenceImageURLs: z.array(z.string()).optional(),
  aspectRatio: AspectRatio,
  resolution: Resolution.optional(),
});
export type GenerationInput = z.infer<typeof GenerationInput>;

export const GenerationState = z.enum([
  "pending",
  "processing",
  "completed",
  "error",
]);

export const GenerationOutput = z.discriminatedUnion("state", [
  z.object({
    id: z.string(),
    state: z.literal(GenerationState.enum.pending),
  }),
  z.object({
    id: z.string(),
    state: z.literal(GenerationState.enum.processing),
  }),
  z.object({
    id: z.string(),
    state: z.literal(GenerationState.enum.completed),
    url: z.string(),
    mimeType: z.string(),
  }),
  z.object({
    id: z.string(),
    state: z.literal(GenerationState.enum.error),
    error: z.string(),
  }),
]);
export type GenerationOutput = z.infer<typeof GenerationOutput>;

export const Generation = z.object({
  id: z.string(),
  input: GenerationInput,
  batchSize: z.number().default(1),
  outputs: z.array(GenerationOutput),
  defaultOutputId: z.string().optional(),
});
export type Generation = z.infer<typeof Generation>;

export function createDefaultGeneration() {
  return GenerationInput.parse({
    provider: "gemini",
    model: "gemini-3-pro-image-preview",
    aspectRatio: "16:9",
    prompt: "",
  });
}
