import { z } from "zod";

export const productVariantSchema = z.object({
  size: z.string().optional(),
  color: z.string().optional(),
  sku: z.string().optional(),
  quantity: z.coerce.number().int().min(0),
});

export const productImageSchema = z.object({
  url: z.string().url(),
  publicId: z.string().optional(),
});

export const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().min(5),
  shortDescription: z.string().optional(),
  categoryId: z.string().min(1),
  price: z.coerce.number().positive(),
  compareAtPrice: z.coerce.number().optional(),
  sku: z.string().optional(),
  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]),
  images: z.array(productImageSchema).default([]),
  variants: z.array(productVariantSchema).min(1, "At least one variant is required"),
  isFeatured: z.coerce.boolean().default(false),
  isNewArrival: z.coerce.boolean().default(false),
  isBestSeller: z.coerce.boolean().default(false),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});