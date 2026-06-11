import { auth } from "../../../auth";
import { prisma } from "@/lib/prisma";

export async function getCurrentUserWishlist() {
  const session = await auth();

  if (!session?.user) return [];

  return prisma.wishlistItem.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      product: {
        include: {
          category: true,
          images: {
            orderBy: { position: "asc" },
            take: 1,
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function isProductWishlisted(productId: string) {
  const session = await auth();

  if (!session?.user) return false;

  const item = await prisma.wishlistItem.findUnique({
    where: {
      userId_productId: {
        userId: session.user.id,
        productId,
      },
    },
  });

  return Boolean(item);
}