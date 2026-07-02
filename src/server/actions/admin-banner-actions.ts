"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { auth } from "../../../auth";
import { prisma } from "@/lib/prisma";
import { bannerSchema } from "@/lib/validations/banner";

async function requireAdmin() {
  const session = await auth();

  if (
    !session?.user ||
    (session.user.role !== "ADMIN" && session.user.role !== "STAFF")
  ) {
    throw new Error("Unauthorized");
  }

  return session;
}

function toDate(value?: string) {
  if (!value) return null;
  return new Date(value);
}

export async function createBannerAction(values: unknown) {
  await requireAdmin();

  const parsed = bannerSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid banner data",
    };
  }

  const data = parsed.data;

  await prisma.banner.create({
    data: {
      title: data.title,
      subtitle: data.subtitle || null,
      description: data.description || null,
      imageUrl: data.image.url,
      imagePublicId: data.image.publicId || null,
      linkUrl: data.linkUrl || null,
      buttonText: data.buttonText || null,
      position: data.position,
      startsAt: toDate(data.startsAt),
      endsAt: toDate(data.endsAt),
      isActive: data.isActive,
    },
  });

  revalidatePath("/admin/banners");
  revalidatePath("/");

  redirect("/admin/banners");
}

export async function updateBannerAction(bannerId: string, values: unknown) {
  await requireAdmin();

  const parsed = bannerSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid banner data",
    };
  }

  const data = parsed.data;

  await prisma.banner.update({
    where: {
      id: bannerId,
    },
    data: {
      title: data.title,
      subtitle: data.subtitle || null,
      description: data.description || null,
      imageUrl: data.image.url,
      imagePublicId: data.image.publicId || null,
      linkUrl: data.linkUrl || null,
      buttonText: data.buttonText || null,
      position: data.position,
      startsAt: toDate(data.startsAt),
      endsAt: toDate(data.endsAt),
      isActive: data.isActive,
    },
  });

  revalidatePath("/admin/banners");
  revalidatePath("/");

  redirect("/admin/banners");
}

export async function toggleBannerStatusAction(bannerId: string) {
  await requireAdmin();

  const banner = await prisma.banner.findUnique({
    where: { id: bannerId },
    select: { isActive: true },
  });

  if (!banner) {
    return {
      success: false,
      message: "Banner not found",
    };
  }

  await prisma.banner.update({
    where: { id: bannerId },
    data: {
      isActive: !banner.isActive,
    },
  });

  revalidatePath("/admin/banners");
  revalidatePath("/");

  return {
    success: true,
  };
}