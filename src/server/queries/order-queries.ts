import { auth } from "../../../auth";
import { prisma } from "@/lib/prisma";

export async function getCurrentUserOrders() {
  const session = await auth();

  if (!session?.user) return [];

  return prisma.order.findMany({
    where: { userId: session.user.id },
    include: {
      items: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getCurrentUserOrderByNumber(orderNumber: string) {
  const session = await auth();

  if (!session?.user) return null;

  return prisma.order.findFirst({
    where: {
      orderNumber,
      userId: session.user.id,
    },
    include: {
      items: true,
    },
  });
}

export async function getAdminOrders() {
  return prisma.order.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      items: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAdminOrderByNumber(orderNumber: string) {
  return prisma.order.findUnique({
    where: { orderNumber },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          phone: true,
        },
      },
      items: true,
    },
  });
}