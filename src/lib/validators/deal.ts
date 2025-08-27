import { z } from "zod";

export const dealItemSchema = z.object({
  id: z.number().optional(), // Optional for updates
  productId: z.number({ required_error: "Product ID is required" }),
  quantity: z
    .number({ required_error: "Quantity is required" })
    .min(1, "Quantity must be at least 1"),
  note: z.string().optional(),
});

export const dealSchema = z
  .object({
    name: z.string().min(1, "Deal name is required"),
    regularPrice: z
      .number({ required_error: "Regular price is required" })
      .nonnegative("Regular price must be 0 or more"),

    offerPrice: z
      .number({ invalid_type_error: "Offer price must be a number" })
      .nonnegative("Offer price must be 0 or more")
      .optional(),

    description: z.string().optional(),

    isFeatured: z.boolean().optional(),
    image: z.string().url("Image must be a valid URL").optional(),
    status: z.boolean({ required_error: "Status is required" }),

    availableFrom: z.string().regex(/^\d{2}:\d{2}$/, {
      message: "Available from must be in HH:MM format",
    }),

    availableUntil: z.string().regex(/^\d{2}:\d{2}$/, {
      message: "Available until must be in HH:MM format",
    }),

    startDate: z
      .string()
      .datetime({ message: "Start date must be a valid ISO date" })
      .optional(),

    endDate: z
      .string()
      .datetime({ message: "End date must be a valid ISO date" })
      .optional(),

    availableDays: z
      .array(
        z.enum(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], {
          required_error: "Day must be one of Mon-Sun",
        }),
      )
      .min(1, "At least one available day is required"),

    dealItems: z
      .array(dealItemSchema, {
        required_error: "At least one deal item is required",
      })
      .min(1, "Deal must include at least one item"),
  })
  .strip();
