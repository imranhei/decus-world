"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { auth } from "../../../auth";

export async function addToCartAction({
  productId,
  variantId,
  quantity = 1,
}: {
  productId: string;
  variantId?: string | null;
  quantity?: number;
}) {
  const session = await auth();

  if (!session?.user) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  if (!variantId) {
    return {
      success: false,
      message: "Please select a variant",
    };
  }

  const variant = await prisma.productVariant.findUnique({
    where: { id: variantId },
    include: {
      inventory: true,
    },
  });

  if (!variant || variant.productId !== productId) {
    return {
      success: false,
      message: "Invalid variant selected",
    };
  }

  const availableStock =
    (variant.inventory?.quantity || 0) - (variant.inventory?.reserved || 0);

  if (availableStock <= 0) {
    return {
      success: false,
      message: "This item is out of stock",
    };
  }

  const existingItem = await prisma.cartItem.findUnique({
    where: {
      userId_productId_variantId: {
        userId: session.user.id,
        productId,
        variantId,
      },
    },
  });

  const nextQuantity = (existingItem?.quantity || 0) + quantity;

  if (nextQuantity > availableStock) {
    return {
      success: false,
      message: `Only ${availableStock} item(s) available`,
    };
  }

  if (existingItem) {
    await prisma.cartItem.update({
      where: {
        id: existingItem.id,
      },
      data: {
        quantity: nextQuantity,
      },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        userId: session.user.id,
        productId,
        variantId,
        quantity,
      },
    });
  }

  revalidatePath("/cart");
  revalidatePath("/products");
  revalidatePath(`/products/${variant.productId}`);

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
    message: "Item removed",
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
    message: "Cart updated",
  };
}

export async function syncGuestCartAction(
  items: {
    productId: string;
    variantId?: string | null;
    quantity: number;
  }[],
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
