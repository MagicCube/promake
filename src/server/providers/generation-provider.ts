import { type GenerationInput } from "@/core/types";
import type { GenerativeModel } from "@/core/types/model";

export interface GenerationProvider {
  name: string;
  displayName: string;

  supportedModels: GenerativeModel[];

  generate?: (
    input: GenerationInput,
  ) => Promise<{ buffer: Buffer; mimeType: string }>;

  batchGenerate?: (
    input: GenerationInput,
    batchSize: number,
  ) => Promise<{ url: string; mimeType: string }[]>;
}
