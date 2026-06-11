import { prisma } from "@/lib/prisma";

export async function getAdminReviews() {
  return prisma.review.findMany({
    include: {
      product: {
        select: {
          name: true,
          slug: true,
        },
      },
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}