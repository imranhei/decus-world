import { prisma } from "@/lib/prisma";

export async function getAdminBanners() {
  return prisma.banner.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getAdminBannerById(id: string) {
  return prisma.banner.findUnique({
    where: { id },
  });
}