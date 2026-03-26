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
    paymentMethod: z.enum([
      "sahal_golis",
      "evc",
      "edahab",
      "salaam_bank_waafi",
      "cash_on_delivery",
    ]),
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
  rating: z.coerce
    .number()
    .min(1, "Rating is required.")
    .max(5, "Maximum rating is 5."),
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

export const adminProductSchema = z.object({
  name: z.string().trim().min(2, "Product name is required."),
  slug: z
    .string()
    .trim()
    .min(2, "Slug is required.")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must use lowercase letters, numbers, and hyphens only.",
    ),
  sku: z.string().trim().min(2, "SKU is required."),
  category_id: z.string().uuid("Please choose a valid category."),
  brand_id: z.string().uuid("Please choose a valid brand."),
  short_description: z
    .string()
    .trim()
    .max(220, "Short description is too long.")
    .optional()
    .or(z.literal("")),
  description: z.string().trim().min(5, "Description is required."),
  price: z.coerce.number().min(0, "Price must be 0 or more."),
  compare_at_price: z
    .union([
      z.coerce.number().min(0, "Compare price must be 0 or more."),
      z.literal(""),
    ])
    .optional(),
  status: z.enum(["draft", "active", "archived"]),
  is_featured: z.boolean(),
  image_alt: z.string().trim().optional().or(z.literal("")),
});

export const branchSchema = z.object({
  name: z.string().trim().min(2, "Branch name is required."),
  slug: z
    .string()
    .trim()
    .min(2, "Slug is required.")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must use lowercase letters, numbers, and hyphens only.",
    ),
  city: z.string().trim().min(2, "City is required."),
  address: z.string().trim().optional().or(z.literal("")),
  phone: z.string().trim().optional().or(z.literal("")),
  email: z
    .string()
    .trim()
    .email("Enter a valid email.")
    .optional()
    .or(z.literal("")),
  is_active: z.boolean(),
});

export const categorySchema = z.object({
  name: z.string().trim().min(2, "Category name is required."),
  slug: z
    .string()
    .trim()
    .min(2, "Slug is required.")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must use lowercase letters, numbers, and hyphens only.",
    ),
  description: z.string().trim().optional().or(z.literal("")),
  is_active: z.boolean(),
});

export const brandSchema = z.object({
  name: z.string().trim().min(2, "Brand name is required."),
  slug: z
    .string()
    .trim()
    .min(2, "Slug is required.")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must use lowercase letters, numbers, and hyphens only.",
    ),
  is_active: z.boolean(),
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
