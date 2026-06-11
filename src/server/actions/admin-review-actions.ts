"use server";

import { revalidatePath } from "next/cache";

import { auth } from "../../../auth";
import { prisma } from "@/lib/prisma";

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

export async function approveReviewAction(reviewId: string) {
  await requireAdmin();

  const review = await prisma.review.update({
    where: { id: reviewId },
    data: { isApproved: true },
    include: {
      product: {
        select: { slug: true },
      },
    },
  });

  revalidatePath("/admin/reviews");
  revalidatePath(`/products/${review.product.slug}`);

  return { success: true };
}

export async function rejectReviewAction(reviewId: string) {
  await requireAdmin();

  const review = await prisma.review.delete({
    where: { id: reviewId },
    include: {
      product: {
        select: { slug: true },
      },
    },
  });

  revalidatePath("/admin/reviews");
  revalidatePath(`/products/${review.product.slug}`);

  return { success: true };
}