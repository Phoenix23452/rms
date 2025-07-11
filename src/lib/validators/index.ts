import { z } from "zod";
import { categorySchema } from "./category";

export const schemaRegistry: Record<string, z.ZodSchema<any>> = {
  category: categorySchema,
};
