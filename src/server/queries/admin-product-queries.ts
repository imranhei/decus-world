import { prisma } from "@/lib/prisma";

export async function getAdminProducts({
  page = 1,
  limit = 10,
}: {
  page?: number;
  limit?: number;
}) {
  const skip = (page - 1) * limit;

  const [products, totalProducts] = await Promise.all([
    prisma.product.findMany({
      include: {
        category: true,
        images: { orderBy: { position: "asc" } },
        variants: { include: { inventory: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),

    prisma.product.count(),
  ]);

  return {
    products,
    totalProducts,
    totalPages: Math.ceil(totalProducts / limit),
    page,
  };
}

export async function getAdminProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: {
      images: { orderBy: { position: "asc" } },
      variants: { include: { inventory: true } },
    },
  });
}

export async function getAdminCategories() {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });
}