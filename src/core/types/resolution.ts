import z from "zod";

export const Resolution = z.enum(["1k", "2k", "4k"]);
export type Resolution = z.infer<typeof Resolution>;
