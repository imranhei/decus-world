import { prisma } from "@/lib/prisma";

export async function getAdminCustomers({
  page = 1,
  limit = 10,
}: {
  page?: number;
  limit?: number;
}) {
  const skip = (page - 1) * limit;

  const [customers, totalCustomers] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        _count: {
          select: {
            orders: true,
          },
        },
      },
    }),

    prisma.user.count(),
  ]);

  return {
    customers,
    totalCustomers,
    totalPages: Math.ceil(totalCustomers / limit),
    page,
  };
}

export async function getAdminCustomerById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: {
      orders: {
        include: {
          items: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
}