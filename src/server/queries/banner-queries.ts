import { prisma } from "@/lib/prisma";

export async function getActiveBanner(position: "HOME_HERO" | "HOME_SECTION") {
  const now = new Date();

  return prisma.banner.findFirst({
    where: {
      position,
      isActive: true,
      OR: [{ startsAt: null }, { startsAt: { lte: now } }],
      AND: [
        {
          OR: [{ endsAt: null }, { endsAt: { gte: now } }],
        },
      ],
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}