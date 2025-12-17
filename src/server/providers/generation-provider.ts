import { type GenerationInput } from "@/core/types";

export interface GenerationProvider {
  name: string;
  generate(
    input: GenerationInput,
  ): Promise<{ buffer: Buffer; mimeType: string }>;
}
