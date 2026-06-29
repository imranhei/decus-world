"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { cloudinary } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validations/product";
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

function splitValues(value?: string) {
  return (
    value
      ?.split(",")
      .map((item) => item.trim())
      .filter(Boolean) || []
  );
}

export async function createProductAction(values: unknown) {
  await requireAdmin();

  const parsed = productSchema.safeParse(values);

  if (!parsed.success) {
    return { success: false, message: "Invalid product data" };
  }

  const data = parsed.data;

  await prisma.product.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
      shortDescription: data.shortDescription,
      categoryId: data.categoryId,
      price: data.price,
      compareAtPrice: data.compareAtPrice || null,
      sku: data.sku || null,
      status: data.status,
      isFeatured: data.isFeatured,
      isNewArrival: data.isNewArrival,
      isBestSeller: data.isBestSeller,
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,

      images: {
        create: data.images.map((image, index) => ({
          url: image.url,
          publicId: image.publicId,
          altText: data.name,
          position: index,
        })),
      },

      variants: {
        create: data.variants.map((variant) => ({
          size: variant.size || null,
          color: variant.color || null,
          sku:
            variant.sku ||
            `${data.slug}-${variant.size || "DEFAULT"}-${variant.color || "DEFAULT"}`
              .toUpperCase()
              .replace(/\s+/g, "-"),
          inventory: {
            create: {
              quantity: variant.quantity,
            },
          },
        })),
      },
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/products");
  redirect("/admin/products");
}

export async function updateProductAction(productId: string, values: unknown) {
  await requireAdmin();

  const parsed = productSchema.safeParse(values);

  if (!parsed.success) {
    return { success: false, message: "Invalid product data" };
  }

  const data = parsed.data;

  await prisma.$transaction(async (tx) => {
    await tx.product.update({
      where: { id: productId },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        shortDescription: data.shortDescription,
        categoryId: data.categoryId,
        price: data.price,
        compareAtPrice: data.compareAtPrice || null,
        sku: data.sku || null,
        status: data.status,
        isFeatured: data.isFeatured,
        isNewArrival: data.isNewArrival,
        isBestSeller: data.isBestSeller,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
      },
    });

    await tx.productImage.deleteMany({
      where: { productId },
    });

    await tx.productImage.createMany({
      data: data.images.map((image, index) => ({
        productId,
        url: image.url,
        publicId: image.publicId,
        altText: data.name,
        position: index,
      })),
    });

    await tx.productVariant.deleteMany({
      where: { productId },
    });

    for (const variant of data.variants) {
      await tx.productVariant.create({
        data: {
          productId,
          size: variant.size || null,
          color: variant.color || null,
          sku:
            variant.sku ||
            `${data.slug}-${variant.size || "DEFAULT"}-${variant.color || "DEFAULT"}`
              .toUpperCase()
              .replace(/\s+/g, "-"),
          inventory: {
            create: {
              quantity: variant.quantity,
            },
          },
        },
      });
    }
  });

  revalidatePath("/admin/products");
  revalidatePath("/products");
  redirect("/admin/products");
}

export async function deleteProductAction(productId: string) {
  await requireAdmin();

  await prisma.product.update({
    where: { id: productId },
    data: { status: "ARCHIVED" },
  });

  revalidatePath("/admin/products");
  revalidatePath("/products");

  return { success: true };
}

export async function deleteCloudinaryImageAction(publicId: string) {
  await requireAdmin();

  if (!publicId) {
    return { success: false, message: "Missing public ID" };
  }

  await cloudinary.uploader.destroy(publicId);

  return { success: true };
}
