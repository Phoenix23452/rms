import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  order: z.number().int().nonnegative().optional(),
  status: z.boolean(),
});
