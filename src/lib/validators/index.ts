import { z } from "zod";
import { categorySchema } from "./category";
import { productSchema } from "./product";
import { dealSchema } from "./deal";
import { orderSchema } from "./order";
import {
  adminCreateSchema,
  customerSignupSchema,
  riderCreateSchema,
} from "./user";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const schemaRegistry: Record<string, z.ZodSchema<any>> = {
  category: categorySchema,
  product: productSchema,
  deal: dealSchema,
  order: orderSchema,
  customerSignup: customerSignupSchema,
  rider: riderCreateSchema,
  admin: adminCreateSchema,
};
