import { z } from "zod";
import { categorySchema } from "./category";
import { productSchema } from "./product";
import { dealSchema } from "./deal";

export const schemaRegistry: Record<string, z.ZodSchema<any>> = {
  category: categorySchema,
  product: productSchema,
  deal: dealSchema,
};
