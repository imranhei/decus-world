import { prisma } from "@/lib/prisma";

export async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: {
      status: "ACTIVE",
      isFeatured: true,
    },
    include: {
      images: {
        orderBy: { position: "asc" },
        take: 1,
      },
      category: true,
      variants: {
        include: {
          inventory: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 8,
  });
}

export async function getProducts() {
  return prisma.product.findMany({
    where: {
      status: "ACTIVE",
    },
    include: {
      images: {
        orderBy: { position: "asc" },
        take: 1,
      },
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: {
      slug,
      status: "ACTIVE",
    },
    include: {
      images: {
        orderBy: { position: "asc" },
      },
      category: true,
      variants: {
        include: {
          inventory: true,
        },
      },
      reviews: {
        where: {
          isApproved: true,
        },
        include: {
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
}