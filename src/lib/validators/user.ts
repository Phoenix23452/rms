import { z } from "zod";

// 🔹 Shared base fields for all user types
const baseUserSchema = z.object({
  fullName: z
    .string({
      required_error: "Full name is required",
      invalid_type_error: "Full name must be a string",
    })
    .min(2, "Full name must be at least 2 characters"),

  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email("Please enter a valid email address"),

  phone: z
    .string({
      required_error: "Phone number is required",
      invalid_type_error: "Phone must be a string",
    })
    .min(8, "Phone number must be at least 8 digits long"),
});

// 🔹 Customer Signup Schema
export const customerSignupSchema = z
  .object({
    password: z
      .string({
        required_error: "Password is required",
        invalid_type_error: "Password must be a string",
      })
      .min(6, "Password must be at least 6 characters long"),

    customer: baseUserSchema,
  })
  .strict(); // prevents extra fields

// 🔹 Rider Create Schema
export const riderCreateSchema = z
  .object({
    password: z
      .string({
        required_error: "Password is required",
        invalid_type_error: "Password must be a string",
      })
      .min(6, "Password must be at least 6 characters long"),
    rider: baseUserSchema,
  })
  .strict();

// 🔹 Admin Create Schema
export const adminCreateSchema = z
  .object({
    password: z
      .string({
        required_error: "Password is required",
        invalid_type_error: "Password must be a string",
      })
      .min(6, "Password must be at least 6 characters long"),

    admin: baseUserSchema,
  })
  .strict();
