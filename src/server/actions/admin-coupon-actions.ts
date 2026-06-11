"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { auth } from "../../../auth";
import { prisma } from "@/lib/prisma";
import { couponSchema } from "@/lib/validations/coupon";

async function requireAdmin() {
  const session = await auth();

  if (
    !session?.user ||
    (session.user.role !== "ADMIN" && session.user.role !== "STAFF")
  ) {
    throw new Error("Unauthorized");
  }

  return session;
}

function toDate(value?: string) {
  if (!value) return null;
  return new Date(value);
}

export async function createCouponAction(values: unknown) {
  await requireAdmin();

  const parsed = couponSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid coupon data",
    };
  }

  const data = parsed.data;

  const existingCoupon = await prisma.coupon.findUnique({
    where: {
      code: data.code,
    },
  });

  if (existingCoupon) {
    return {
      success: false,
      message: "Coupon code already exists",
    };
  }

  await prisma.coupon.create({
    data: {
      code: data.code,
      description: data.description || null,
      discountType: data.discountType,
      discountValue: data.discountValue,
      minimumOrderAmount: data.minimumOrderAmount || null,
      maximumDiscountAmount: data.maximumDiscountAmount || null,
      usageLimit: data.usageLimit || null,
      startsAt: toDate(data.startsAt),
      expiresAt: toDate(data.expiresAt),
      isActive: data.isActive,
    },
  });

  revalidatePath("/admin/coupons");
  redirect("/admin/coupons");
}

export async function updateCouponAction(couponId: string, values: unknown) {
  await requireAdmin();

  const parsed = couponSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid coupon data",
    };
  }

  const data = parsed.data;

  const existingCode = await prisma.coupon.findFirst({
    where: {
      code: data.code,
      id: {
        not: couponId,
      },
    },
  });

  if (existingCode) {
    return {
      success: false,
      message: "Coupon code already exists",
    };
  }

  await prisma.coupon.update({
    where: {
      id: couponId,
    },
    data: {
      code: data.code,
      description: data.description || null,
      discountType: data.discountType,
      discountValue: data.discountValue,
      minimumOrderAmount: data.minimumOrderAmount || null,
      maximumDiscountAmount: data.maximumDiscountAmount || null,
      usageLimit: data.usageLimit || null,
      startsAt: toDate(data.startsAt),
      expiresAt: toDate(data.expiresAt),
      isActive: data.isActive,
    },
  });

  revalidatePath("/admin/coupons");
  redirect("/admin/coupons");
}

export async function toggleCouponStatusAction(couponId: string) {
  await requireAdmin();

  const coupon = await prisma.coupon.findUnique({
    where: {
      id: couponId,
    },
    select: {
      isActive: true,
    },
  });

  if (!coupon) {
    return {
      success: false,
      message: "Coupon not found",
    };
  }

  await prisma.coupon.update({
    where: {
      id: couponId,
    },
    data: {
      isActive: !coupon.isActive,
    },
  });

  revalidatePath("/admin/coupons");

  return {
    success: true,
  };
}