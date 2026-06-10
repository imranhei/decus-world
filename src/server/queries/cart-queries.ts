import { auth } from "../../../auth";
import { prisma } from "@/lib/prisma";

export async function getCurrentUserCart() {
  const session = await auth();

  if (!session?.user) {
    return [];
  }

  return prisma.cartItem.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      product: {
        include: {
          images: {
            orderBy: {
              position: "asc",
            },
            take: 1,
          },
        },
      },
      variant: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}