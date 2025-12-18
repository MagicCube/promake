import { z } from "zod";

import { Resolution } from "./resolution";

export const GenerativeModel = z.object({
  name: z.string(),
  displayName: z.string(),
  supportBatchGeneration: z.boolean().optional(),
  supportedBatchSizes: z.number().array().optional(),
  supportedResolutions: Resolution.array().optional(),
});

export type GenerativeModel = z.infer<typeof GenerativeModel>;
