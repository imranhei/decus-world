import { auth } from "../../../auth";
import { prisma } from "@/lib/prisma";
import type { OrderStatus, PaymentMethod, PaymentStatus } from "@prisma/client";

type GetAdminOrdersParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  sort?: string;
};

export async function getCurrentUserOrders() {
  const session = await auth();

  if (!session?.user) return [];

  return prisma.order.findMany({
    where: { userId: session.user.id },
    include: {
      items: {
        include: {
          product: {
            select: {
              slug: true,
            },
          },
        },
      },
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
      items: {
        include: {
          product: {
            select: {
              slug: true,
            },
          },
        },
      },
    },
  });
}

export async function getAdminOrders({
  page = 1,
  limit = 20,
  search,
  status,
  paymentMethod,
  paymentStatus,
  sort,
}: GetAdminOrdersParams) {
  const skip = (page - 1) * limit;

  const where = {
    ...(search
      ? {
          OR: [
            {
              orderNumber: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              customerName: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              customerEmail: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              customerPhone: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              items: {
                some: {
                  OR: [
                    {
                      productName: {
                        contains: search,
                        mode: "insensitive" as const,
                      },
                    },
                    {
                      sku: {
                        contains: search,
                        mode: "insensitive" as const,
                      },
                    },
                  ],
                },
              },
            },
          ],
        }
      : {}),

    ...(status ? { status: status as OrderStatus } : {}),
    ...(paymentMethod ? { paymentMethod: paymentMethod as PaymentMethod } : {}),
    ...(paymentStatus ? { paymentStatus: paymentStatus as PaymentStatus } : {}),
  };

  const orderBy =
    sort === "oldest"
      ? { createdAt: "asc" as const }
      : sort === "highest"
        ? { total: "desc" as const }
        : sort === "lowest"
          ? { total: "asc" as const }
          : { createdAt: "desc" as const };

  const [orders, totalOrders] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        items: true,
      },
      orderBy,
      skip,
      take: limit,
    }),

    prisma.order.count({ where }),
  ]);

  return {
    orders,
    totalOrders,
    totalPages: Math.ceil(totalOrders / limit),
    page,
  };
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
      items: {
        include: {
          product: {
            select: {
              slug: true,
            },
          },
        },
      },
    },
  });
}