import { prisma } from "@/lib/prisma";

export async function getAdminDashboardStats() {
  const [
    totalRevenue,
    totalOrders,
    pendingOrders,
    totalProducts,
    activeProducts,
    totalCustomers,
    recentOrders,
    lowStockVariants,
    orderStatusCounts,
  ] = await Promise.all([
    prisma.order.aggregate({
      _sum: { total: true },
      where: {
        status: {
          notIn: ["CANCELLED", "RETURNED"],
        },
      },
    }),

    prisma.order.count(),

    prisma.order.count({
      where: {
        status: "PENDING",
      },
    }),

    prisma.product.count(),

    prisma.product.count({
      where: {
        status: "ACTIVE",
      },
    }),

    prisma.user.count({
      where: {
        role: "CUSTOMER",
      },
    }),

    prisma.order.findMany({
      take: 6,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        items: true,
      },
    }),

    prisma.productVariant.findMany({
      where: {
        inventory: {
          quantity: {
            lte: 10,
          },
        },
      },
      include: {
        product: true,
        inventory: true,
      },
      take: 8,
      orderBy: {
        updatedAt: "desc",
      },
    }),

    prisma.order.groupBy({
      by: ["status"],
      _count: {
        status: true,
      },
    }),
  ]);

  return {
    totalRevenue: Number(totalRevenue._sum.total || 0),
    totalOrders,
    pendingOrders,
    totalProducts,
    activeProducts,
    totalCustomers,
    recentOrders,
    lowStockVariants,
    orderStatusCounts,
  };
}