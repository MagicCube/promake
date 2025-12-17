import { GeminiGenerationProvider } from "./gemini";

export function createGenerationProvider(providerName: string) {
  switch (providerName) {
    case "gemini":
      return new GeminiGenerationProvider();
    default:
      throw new Error("Unknown provider: " + providerName);
  }
}
