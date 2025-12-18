import z from "zod";

import { GenerativeModel } from "@/core/types";
import { GeminiGenerationProvider } from "@/server/providers/gemini";
import { MidjourneyGenerationProvider } from "@/server/providers/midjourney";

import { createTRPCRouter, protectedProcedure } from "../../api/trpc";

const providers = [
  new GeminiGenerationProvider(),
  new MidjourneyGenerationProvider(),
];

export const router = createTRPCRouter({
  list: protectedProcedure
    .output(
      z.array(
        z.object({
          name: z.string(),
          displayName: z.string(),
          supportedModels: z.array(GenerativeModel),
        }),
      ),
    )
    .query(() => {
      return providers.map((provider) => ({
        name: provider.name,
        displayName: provider.displayName,
        supportedModels: provider.supportedModels,
      }));
    }),
});
