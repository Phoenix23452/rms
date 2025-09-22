import { z } from "zod";

export const variantSchema = z.object({
  id: z.number().optional(), // Optional for updates
  name: z.string().min(1, "Variant name is required"),
  price: z
    .number({ invalid_type_error: "Price must be a number" })
    .nonnegative("Price cannot be negative"),
});

export const productSchema = z
  .object({
    name: z.string().min(1, "Product name is required"),
    slug: z.string().min(1, "Slug is required"),
    categoryId: z.number({ required_error: "Category is required" }),
    status: z.boolean(),
    regularPrice: z
      .number({ required_error: "Regular price is required" })
      .nonnegative("Price cannot be negative"),
    discountPercentage: z
      .number()
      .min(0, "Cannot be below 0")
      .max(100, "Cannot exceed 100")
      .optional(),
    description: z.string().optional(),
    isFeatured: z.boolean().optional(),
    isPopular: z.boolean().optional(),
    image: z.string().url("Must be a valid URL").optional(),
    variants: z.array(variantSchema).optional(),
    // Validate optionalItems as an array of product IDs (optional)
    optionalItems: z.array(z.number().int().positive()).optional(),
  })
  .strip();
