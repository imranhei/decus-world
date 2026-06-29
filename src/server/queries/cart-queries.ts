import { prisma } from "@/lib/prisma";
import { auth } from "../../../auth";

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

export async function getCurrentUserCartCount() {
  const session = await auth();

  if (!session?.user) return 0;

  const items = await prisma.cartItem.findMany({
    where: {
      userId: session.user.id,
    },
    select: {
      quantity: true,
    },
  });

  return items.reduce((total, item) => total + item.quantity, 0);
}
