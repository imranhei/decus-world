"use server";

import { revalidatePath } from "next/cache";

import { auth } from "../../../auth";
import { prisma } from "@/lib/prisma";

export async function toggleWishlistAction(productId: string) {
  const session = await auth();

  if (!session?.user) {
    return {
      success: false,
      message: "Please login to use wishlist",
    };
  }

  const existingItem = await prisma.wishlistItem.findUnique({
    where: {
      userId_productId: {
        userId: session.user.id,
        productId,
      },
    },
  });

  if (existingItem) {
    await prisma.wishlistItem.delete({
      where: {
        id: existingItem.id,
      },
    });

    revalidatePath("/account/wishlist");
    revalidatePath("/products");

    return {
      success: true,
      isWishlisted: false,
      message: "Removed from wishlist",
    };
  }

  await prisma.wishlistItem.create({
    data: {
      userId: session.user.id,
      productId,
    },
  });

  revalidatePath("/account/wishlist");
  revalidatePath("/products");

  return {
    success: true,
    isWishlisted: true,
    message: "Added to wishlist",
  };
}