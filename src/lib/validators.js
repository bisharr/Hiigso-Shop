import { z } from "zod";

export const registerSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters."),
  email: z.string().trim().email("Enter a valid email address."),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters.")
    .max(100, "Password is too long."),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

export const checkoutSchema = z
  .object({
    contactName: z.string().trim().min(2, "Full name is required."),
    contactPhone: z.string().trim().min(7, "Phone number is too short."),
    contactEmail: z
      .string()
      .trim()
      .email("Enter a valid email.")
      .optional()
      .or(z.literal("")),
    deliveryAddress: z.string().trim().optional().or(z.literal("")),
    fulfillmentMethod: z.enum(["pickup", "delivery"]),
    branchId: z.string().uuid("Please choose a valid branch."),
    customerNote: z
      .string()
      .max(500, "Note is too long.")
      .optional()
      .or(z.literal("")),
  })
  .superRefine((values, ctx) => {
    if (
      values.fulfillmentMethod === "delivery" &&
      !values.deliveryAddress?.trim()
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["deliveryAddress"],
        message: "Delivery address is required for delivery orders.",
      });
    }
  });

export const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  title: z
    .string()
    .trim()
    .max(120, "Title is too long.")
    .optional()
    .or(z.literal("")),
  comment: z
    .string()
    .trim()
    .max(1000, "Comment is too long.")
    .optional()
    .or(z.literal("")),
});

export function validateWithZod(schema, values) {
  const result = schema.safeParse(values);

  if (result.success) {
    return { success: true, data: result.data, errors: {} };
  }

  const errors = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0];
    if (!errors[key]) {
      errors[key] = issue.message;
    }
  }

  return { success: false, data: null, errors };
}
