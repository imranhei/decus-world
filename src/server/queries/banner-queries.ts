import { prisma } from "@/lib/prisma";
import type { BannerPosition } from "@prisma/client";

export async function getActiveBanners(position: BannerPosition) {
  const now = new Date();

  return prisma.banner.findMany({
    where: {
      position,
      isActive: true,
      OR: [
        {
          startsAt: null,
          endsAt: null,
        },
        {
          startsAt: {
            lte: now,
          },
          endsAt: null,
        },
        {
          startsAt: null,
          endsAt: {
            gte: now,
          },
        },
        {
          startsAt: {
            lte: now,
          },
          endsAt: {
            gte: now,
          },
        },
      ],
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}