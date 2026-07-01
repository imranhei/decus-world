import { prisma } from "@/lib/prisma";
import type { Role } from "@prisma/client";

type GetAdminCustomersParams = {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  sort?: string;
};

export async function getAdminCustomers({
  page = 1,
  limit = 20,
  search,
  role,
  sort,
}: GetAdminCustomersParams) {
  const skip = (page - 1) * limit;

  const where = {
    ...(search
      ? {
          OR: [
            {
              name: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              email: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              phone: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              city: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              address: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {}),

    ...(role ? { role: role as Role } : {}),
  };

  const orderBy =
    sort === "oldest"
      ? { createdAt: "asc" as const }
      : sort === "name-asc"
        ? { name: "asc" as const }
        : sort === "name-desc"
          ? { name: "desc" as const }
          : { createdAt: "desc" as const };

  const [customers, totalCustomers] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy,
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

    prisma.user.count({ where }),
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