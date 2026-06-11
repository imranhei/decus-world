import { prisma } from "@/lib/prisma";

type GetProductsParams = {
  search?: string;
  category?: string;
  sort?: string;
  featured?: string;
  newArrival?: string;
  bestSeller?: string;
  page?: string;
};

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

export async function getProducts(params: GetProductsParams = {}) {
  const page = Number(params.page || 1);
  const limit = 12;
  const skip = (page - 1) * limit;

  const where = {
    status: "ACTIVE" as const,

    ...(params.search
      ? {
          OR: [
            { name: { contains: params.search, mode: "insensitive" as const } },
            {
              description: {
                contains: params.search,
                mode: "insensitive" as const,
              },
            },
            {
              shortDescription: {
                contains: params.search,
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {}),

    ...(params.category
      ? {
          category: {
            slug: params.category,
          },
        }
      : {}),

    ...(params.featured === "true" ? { isFeatured: true } : {}),
    ...(params.newArrival === "true" ? { isNewArrival: true } : {}),
    ...(params.bestSeller === "true" ? { isBestSeller: true } : {}),
  };

  const orderBy =
    params.sort === "price-asc"
      ? { price: "asc" as const }
      : params.sort === "price-desc"
        ? { price: "desc" as const }
        : params.sort === "oldest"
          ? { createdAt: "asc" as const }
          : { createdAt: "desc" as const };

  const [products, totalProducts] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        images: {
          orderBy: { position: "asc" },
          take: 1,
        },
        category: true,
      },
      orderBy,
      skip,
      take: limit,
    }),

    prisma.product.count({
      where,
    }),
  ]);

  return {
    products,
    totalProducts,
    totalPages: Math.ceil(totalProducts / limit),
    page,
  };
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

export async function getActiveCategories() {
  return prisma.category.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      name: "asc",
    },
  });
}