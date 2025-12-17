import z from "zod";

import { Generation } from "./generation";

export const Project = z.object({
  id: z.string(),
  name: z.string(),
  generations: z.array(Generation),
});
export type Project = z.infer<typeof Project>;
