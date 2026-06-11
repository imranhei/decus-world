"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { categorySchema } from "@/lib/validations/category";
import { auth } from "../../../auth";

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

export async function createCategoryAction(values: unknown) {
  await requireAdmin();

  const parsed = categorySchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid category data",
    };
  }

  const data = parsed.data;

  const existingCategory = await prisma.category.findUnique({
    where: {
      slug: data.slug,
    },
  });

  if (existingCategory) {
    return {
      success: false,
      message: "Category slug already exists",
    };
  }

  await prisma.category.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description || null,
      imageUrl: data.image?.url || null,
      imagePublicId: data.image?.publicId || null,
      parentId: data.parentId || null,
      isActive: data.isActive,
    },
  });

  revalidatePath("/admin/categories");
  revalidatePath("/products");

  redirect("/admin/categories");
}

export async function updateCategoryAction(
  categoryId: string,
  values: unknown,
) {
  await requireAdmin();

  const parsed = categorySchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid category data",
    };
  }

  const data = parsed.data;

  if (data.parentId === categoryId) {
    return {
      success: false,
      message: "Category cannot be parent of itself",
    };
  }

  const existingSlug = await prisma.category.findFirst({
    where: {
      slug: data.slug,
      id: {
        not: categoryId,
      },
    },
  });

  if (existingSlug) {
    return {
      success: false,
      message: "Category slug already exists",
    };
  }

  await prisma.category.update({
    where: {
      id: categoryId,
    },
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description || null,
      imageUrl: data.image?.url || null,
      imagePublicId: data.image?.publicId || null,
      parentId: data.parentId || null,
      isActive: data.isActive,
    },
  });

  revalidatePath("/admin/categories");
  revalidatePath("/products");

  redirect("/admin/categories");
}

export async function toggleCategoryStatusAction(categoryId: string) {
  await requireAdmin();

  const category = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
    select: {
      isActive: true,
    },
  });

  if (!category) {
    return {
      success: false,
      message: "Category not found",
    };
  }

  await prisma.category.update({
    where: {
      id: categoryId,
    },
    data: {
      isActive: !category.isActive,
    },
  });

  revalidatePath("/admin/categories");
  revalidatePath("/products");

  return {
    success: true,
  };
}
