import { prisma } from "@/lib/prisma";

export async function getAdminCategories() {
  return prisma.category.findMany({
    include: {
      parent: true,
      children: true,
      _count: {
        select: {
          products: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getCategoryById(id: string) {
  return prisma.category.findUnique({
    where: { id },
  });
}

export async function getParentCategoryOptions(excludeId?: string) {
  return prisma.category.findMany({
    where: {
      isActive: true,
      id: excludeId ? { not: excludeId } : undefined,
    },
    orderBy: {
      name: "asc",
    },
  });
}