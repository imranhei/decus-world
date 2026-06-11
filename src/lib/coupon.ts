import type { Coupon } from "@prisma/client";

export function calculateCouponDiscount({
  coupon,
  subtotal,
}: {
  coupon: Coupon;
  subtotal: number;
}) {
  if (!coupon.isActive) return 0;

  const now = new Date();

  if (coupon.startsAt && coupon.startsAt > now) return 0;
  if (coupon.expiresAt && coupon.expiresAt < now) return 0;

  if (
    coupon.minimumOrderAmount &&
    subtotal < Number(coupon.minimumOrderAmount)
  ) {
    return 0;
  }

  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    return 0;
  }

  let discount = 0;

  if (coupon.discountType === "PERCENTAGE") {
    discount = subtotal * (Number(coupon.discountValue) / 100);
  }

  if (coupon.discountType === "FIXED") {
    discount = Number(coupon.discountValue);
  }

  if (coupon.maximumDiscountAmount) {
    discount = Math.min(discount, Number(coupon.maximumDiscountAmount));
  }

  return Math.min(discount, subtotal);
}