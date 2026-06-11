import { prisma } from "@/lib/prisma";

export async function getAdminCoupons() {
  return prisma.coupon.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getAdminCouponById(id: string) {
  return prisma.coupon.findUnique({
    where: { id },
  });
}