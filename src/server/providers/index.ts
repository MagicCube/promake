import { GeminiGenerationProvider } from "./gemini";
import type { GenerationProvider } from "./generation-provider";
import { MidjourneyGenerationProvider } from "./midjourney";

export function createGenerationProvider(
  providerName: string,
): GenerationProvider {
  switch (providerName) {
    case "gemini":
      return new GeminiGenerationProvider();
    case "midjourney":
      return new MidjourneyGenerationProvider();
    default:
      throw new Error("Unknown provider: " + providerName);
  }
}
