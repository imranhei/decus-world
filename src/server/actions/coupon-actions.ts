"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { calculateCouponDiscount } from "@/lib/coupon";

const COUPON_COOKIE_NAME = "decus_coupon";

export async function applyCouponAction({
  code,
  subtotal,
}: {
  code: string;
  subtotal: number;
}) {
  const normalizedCode = code.trim().toUpperCase();

  if (!normalizedCode) {
    return {
      success: false,
      message: "Coupon code is required",
    };
  }

  const coupon = await prisma.coupon.findUnique({
    where: {
      code: normalizedCode,
    },
  });

  if (!coupon) {
    return {
      success: false,
      message: "Invalid coupon code",
    };
  }

  const discount = calculateCouponDiscount({
    coupon,
    subtotal,
  });

  if (discount <= 0) {
    return {
      success: false,
      message: "Coupon is not applicable",
    };
  }

  const cookieStore = await cookies();

  cookieStore.set(COUPON_COOKIE_NAME, normalizedCode, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  revalidatePath("/cart");
  revalidatePath("/checkout");

  return {
    success: true,
    message: "Coupon applied",
    discount,
  };
}

export async function removeCouponAction() {
  const cookieStore = await cookies();

  cookieStore.delete(COUPON_COOKIE_NAME);

  revalidatePath("/cart");
  revalidatePath("/checkout");

  return {
    success: true,
  };
}

export async function getAppliedCoupon(subtotal: number) {
  const cookieStore = await cookies();
  const code = cookieStore.get(COUPON_COOKIE_NAME)?.value;

  if (!code) {
    return null;
  }

  const coupon = await prisma.coupon.findUnique({
    where: {
      code,
    },
  });

  if (!coupon) {
    return null;
  }

  const discount = calculateCouponDiscount({
    coupon,
    subtotal,
  });

  if (discount <= 0) {
    return null;
  }

  return {
    coupon,
    discount,
  };
}