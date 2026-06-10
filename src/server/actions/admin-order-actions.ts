"use server";

import { revalidatePath } from "next/cache";
import { OrderStatus } from "@prisma/client";

import { auth } from "../../../auth";
import { prisma } from "@/lib/prisma";

export async function updateOrderStatusAction({
  orderId,
  status,
}: {
  orderId: string;
  status: OrderStatus;
}) {
  const session = await auth();

  if (
    !session?.user ||
    (session.user.role !== "ADMIN" && session.user.role !== "STAFF")
  ) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });

  revalidatePath("/admin/orders");

  return {
    success: true,
    message: "Order status updated",
  };
}