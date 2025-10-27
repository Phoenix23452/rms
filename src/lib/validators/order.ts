import { z } from "zod";

// ----- ENUMS -----
export const orderStatusEnum = z.enum([
  "PLACED",
  "CONFIRMED",
  "DISPATCHED",
  "DELIVERED",
  "CANCELLED",
]);

export const orderTypeEnum = z.enum(["PICKUP", "DINEIN", "DELIVERY"]);

export const paymentTypeEnum = z.enum([
  "MOBILE_PAYMENT",
  "COD",
  "CARD_PAYMENT",
]);

// ----- ORDER ITEM SCHEMA -----
export const orderItemSchema = z.object({
  id: z.number().optional(), // Optional for updates
  variantId: z
    .number({ required_error: "Variant ID is required" })
    .int()
    .positive(),
  quantity: z
    .number({ required_error: "Quantity is required" })
    .int()
    .min(1, "Quantity must be at least 1"),
  unitPrice: z
    .number({ required_error: "Unit price is required" })
    .nonnegative("Unit price cannot be negative"),
  price: z
    .number({ required_error: "Price is required" })
    .nonnegative("Price cannot be negative"),
  note: z.string().optional(),
  regularPrice: z
    .number({ required_error: "Regular price is required" })
    .nonnegative("Price cannot be negative"),
  discountPercentage: z
    .number()
    .min(0, "Cannot be below 0")
    .max(100, "Cannot exceed 100"),
  optionalItems: z
    .array(
      z.union([
        z.number().int().positive(),
        z.object({ id: z.number().int().positive() }),
      ]),
    )
    .optional()
    .transform((items) =>
      items?.map((i) => (typeof i === "number" ? i : i.id)),
    ),
});

// ----- MAIN ORDER SCHEMA -----
export const orderSchema = z
  .object({
    id: z.number().optional(), // Optional for updates
    customerId: z.number().positive().optional(), // ✅ optional now
    customer: z
      .object({
        fullName: z.string().min(1, "Full name is required"),
        phone: z
          .string()
          .min(8, "Phone number must be valid")
          .max(20, "Phone number too long"),
        email: z.string().email("Must be a valid email"),
      })
      .optional(), // ✅ added guest info block
    total: z
      .number({ required_error: "Total amount is required" })
      .nonnegative("Total cannot be negative"),
    subtotal: z
      .number({ required_error: "Subtotal is required" })
      .nonnegative("Subtotal cannot be negative"),
    deliveryFee: z.number().nonnegative().default(0),
    tax: z.number().nonnegative().default(0),
    tip: z.number().nonnegative().default(0),
    status: orderStatusEnum.default("PLACED"),
    paymentMethod: paymentTypeEnum,
    orderType: orderTypeEnum.default("DELIVERY"),
    deliveryNote: z.string().optional(),
    address: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    items: z
      .array(orderItemSchema)
      .min(1, "Order must include at least one item"),
  })
  .strip()
  .refine((data) => data.customerId || data.customer, {
    message: "Either customerId or customer info must be provided",
    path: ["customer"],
  });
