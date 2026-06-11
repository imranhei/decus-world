import { z } from "zod";

export const couponSchema = z.object({
  code: z.string().min(2).transform((value) => value.toUpperCase()),
  description: z.string().optional(),
  discountType: z.enum(["PERCENTAGE", "FIXED"]),
  discountValue: z.coerce.number().positive(),
  minimumOrderAmount: z.coerce.number().optional(),
  maximumDiscountAmount: z.coerce.number().optional(),
  usageLimit: z.coerce.number().int().positive().optional(),
  startsAt: z.string().optional(),
  expiresAt: z.string().optional(),
  isActive: z.coerce.boolean().default(true),
});