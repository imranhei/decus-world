"use server";

import { revalidatePath } from "next/cache";

import { auth } from "../../../auth";
import { prisma } from "@/lib/prisma";

export async function addToCartAction({
  productId,
  variantId,
  quantity,
}: {
  productId: string;
  variantId?: string | null;
  quantity: number;
}) {
  const session = await auth();

  if (!session?.user) {
    return {
      success: false,
      message: "Please login to sync cart",
    };
  }

  const product = await prisma.product.findFirst({
    where: {
      id: productId,
      status: "ACTIVE",
    },
  });

  if (!product) {
    return {
      success: false,
      message: "Product not found",
    };
  }

  if (variantId) {
    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
      include: { inventory: true },
    });

    if (!variant || variant.productId !== productId) {
      return {
        success: false,
        message: "Invalid product variant",
      };
    }

    const availableStock =
      (variant.inventory?.quantity || 0) - (variant.inventory?.reserved || 0);

    if (availableStock < quantity) {
      return {
        success: false,
        message: "Not enough stock available",
      };
    }
  }

  const existingItem = await prisma.cartItem.findFirst({
    where: {
      userId: session.user.id,
      productId,
      variantId: variantId || null,
    },
  });

  if (existingItem) {
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: {
        quantity: existingItem.quantity + quantity,
      },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        userId: session.user.id,
        productId,
        variantId: variantId || null,
        quantity,
      },
    });
  }

  revalidatePath("/cart");

  return {
    success: true,
    message: "Added to cart",
  };
}

export async function removeCartItemAction(cartItemId: string) {
  const session = await auth();

  if (!session?.user) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  await prisma.cartItem.deleteMany({
    where: {
      id: cartItemId,
      userId: session.user.id,
    },
  });

  revalidatePath("/cart");

  return {
    success: true,
  };
}

export async function updateCartItemQuantityAction({
  cartItemId,
  quantity,
}: {
  cartItemId: string;
  quantity: number;
}) {
  const session = await auth();

  if (!session?.user) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  if (quantity <= 0) {
    await prisma.cartItem.deleteMany({
      where: {
        id: cartItemId,
        userId: session.user.id,
      },
    });
  } else {
    await prisma.cartItem.updateMany({
      where: {
        id: cartItemId,
        userId: session.user.id,
      },
      data: {
        quantity,
      },
    });
  }

  revalidatePath("/cart");

  return {
    success: true,
  };
}

export async function syncGuestCartAction(
  items: {
    productId: string;
    variantId?: string | null;
    quantity: number;
  }[]
) {
  const session = await auth();

  if (!session?.user) {
    return { success: false, message: "Unauthorized" };
  }

  for (const item of items) {
    await addToCartAction({
      productId: item.productId,
      variantId: item.variantId,
      quantity: item.quantity,
    });
  }

  revalidatePath("/cart");

  return { success: true };
}