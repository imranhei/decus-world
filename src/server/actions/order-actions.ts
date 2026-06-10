"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { auth } from "../../../auth";
import { prisma } from "@/lib/prisma";
import { checkoutSchema } from "@/lib/validations/checkout";

function generateOrderNumber() {
  return `DW-${Date.now()}`;
}

export async function placeCashOnDeliveryOrderAction(values: unknown) {
  const session = await auth();

  if (!session?.user) {
    return { success: false, message: "Please login to checkout" };
  }

  const validatedFields = checkoutSchema.safeParse(values);

  if (!validatedFields.success) {
    return { success: false, message: "Invalid checkout information" };
  }

  const cartItems = await prisma.cartItem.findMany({
    where: { userId: session.user.id },
    include: {
      product: true,
      variant: {
        include: {
          inventory: true,
        },
      },
    },
  });

  if (!cartItems.length) {
    return { success: false, message: "Your cart is empty" };
  }

  for (const item of cartItems) {
    if (!item.variant?.inventory) {
      return { success: false, message: "Inventory not found" };
    }

    const availableStock =
      item.variant.inventory.quantity - item.variant.inventory.reserved;

    if (availableStock < item.quantity) {
      return {
        success: false,
        message: `${item.product.name} does not have enough stock`,
      };
    }
  }

  const subtotal = cartItems.reduce((total, item) => {
    return total + Number(item.product.price) * item.quantity;
  }, 0);

  const shippingTotal = subtotal >= 3000 ? 0 : 100;
  const discountTotal = 0;
  const taxTotal = 0;
  const total = subtotal + shippingTotal - discountTotal + taxTotal;

  const data = validatedFields.data;

  const order = await prisma.$transaction(async (tx) => {
    const createdOrder = await tx.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: session.user.id,

        paymentMethod: "CASH_ON_DELIVERY",
        paymentStatus: "UNPAID",
        status: "PENDING",

        subtotal,
        shippingTotal,
        discountTotal,
        taxTotal,
        total,

        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        shippingAddress: data.shippingAddress,
        shippingCity: data.shippingCity,
        shippingPostalCode: data.shippingPostalCode,
        notes: data.notes,

        items: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            productName: item.product.name,
            sku: item.variant?.sku || item.product.sku,
            size: item.variant?.size,
            color: item.variant?.color,
            quantity: item.quantity,
            unitPrice: item.product.price,
            totalPrice: Number(item.product.price) * item.quantity,
          })),
        },
      },
    });

    for (const item of cartItems) {
      if (item.variantId) {
        await tx.inventory.update({
          where: { variantId: item.variantId },
          data: {
            quantity: {
              decrement: item.quantity,
            },
          },
        });
      }
    }

    await tx.cartItem.deleteMany({
      where: { userId: session.user.id },
    });

    return createdOrder;
  });

  revalidatePath("/cart");
  revalidatePath("/account/orders");

  redirect(`/checkout/success?order=${order.orderNumber}`);
}