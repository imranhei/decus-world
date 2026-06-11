"use server";

import { revalidatePath } from "next/cache";

import { auth } from "../../../auth";
import { prisma } from "@/lib/prisma";
import { reviewSchema } from "@/lib/validations/review";

export async function submitReviewAction(values: unknown) {
  const session = await auth();

  if (!session?.user) {
    return { success: false, message: "Please login to submit a review" };
  }

  const parsed = reviewSchema.safeParse(values);

  if (!parsed.success) {
    return { success: false, message: "Invalid review data" };
  }

  const data = parsed.data;

  const product = await prisma.product.findUnique({
    where: { id: data.productId },
    select: { id: true, slug: true },
  });

  if (!product) {
    return { success: false, message: "Product not found" };
  }

  const existingReview = await prisma.review.findUnique({
    where: {
      userId_productId: {
        userId: session.user.id,
        productId: data.productId,
      },
    },
  });

  if (existingReview) {
    return {
      success: false,
      message: "You already reviewed this product",
    };
  }

  await prisma.review.create({
    data: {
      userId: session.user.id,
      productId: data.productId,
      rating: data.rating,
      comment: data.comment,
      isApproved: false,
    },
  });

  revalidatePath(`/products/${product.slug}`);

  return {
    success: true,
    message: "Review submitted. It will appear after admin approval.",
  };
}