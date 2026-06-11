import { z } from "zod";

export const bannerSchema = z.object({
  title: z.string().min(2, "Title is required"),
  subtitle: z.string().optional(),
  image: z.object({
    url: z.string().url(),
    publicId: z.string().optional(),
  }),
  linkUrl: z.string().optional(),
  buttonText: z.string().optional(),
  position: z.enum(["HOME_HERO", "HOME_SECTION", "PRODUCT_PAGE", "CATEGORY_PAGE"]),
  startsAt: z.string().optional(),
  endsAt: z.string().optional(),
  isActive: z.coerce.boolean().default(true),
});