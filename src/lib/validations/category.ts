import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z.string().min(2, "Slug is required"),
  description: z.string().optional(),
  image: z
    .object({
      url: z.string().url(),
      publicId: z.string().optional(),
    })
    .nullable()
    .optional(),
  parentId: z.string().optional(),
  isActive: z.coerce.boolean().default(true),
});