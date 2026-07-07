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
      shortDescription: data.shortDescription || null,
      categoryId: data.categoryId,
      price: data.price,
      compareAtPrice: data.compareAtPrice || null,
      sku: data.sku || null,
      status: data.status,
      isFeatured: data.isFeatured,
      isNewArrival: data.isNewArrival,
      isBestSeller: data.isBestSeller,
      metaTitle: data.metaTitle || null,
      metaDescription: data.metaDescription || null,

      images: {
        create: data.images.map((image, index) => ({
          url: image.url,
          publicId: image.publicId || null,
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
              reserved: 0,
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
    return {
      success: false,
      message: "Invalid product data",
    };
  }

  const data = parsed.data;

  const oldImages = await prisma.productImage.findMany({
    where: { productId },
    select: {
      publicId: true,
    },
  });

  const newPublicIds = new Set(
    data.images.map((image) => image.publicId).filter(Boolean),
  );

  const removedPublicIds = oldImages
    .map((image) => image.publicId)
    .filter((publicId): publicId is string => {
      return Boolean(publicId) && !newPublicIds.has(publicId as string);
    });

  await prisma.product.update({
    where: { id: productId },
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
      shortDescription: data.shortDescription || null,
      categoryId: data.categoryId,
      price: data.price,
      compareAtPrice: data.compareAtPrice || null,
      sku: data.sku || null,
      status: data.status,
      isFeatured: data.isFeatured,
      isNewArrival: data.isNewArrival,
      isBestSeller: data.isBestSeller,
      metaTitle: data.metaTitle || null,
      metaDescription: data.metaDescription || null,
    },
  });

  await prisma.productImage.deleteMany({
    where: { productId },
  });

  if (data.images.length) {
    await prisma.productImage.createMany({
      data: data.images.map((image, index) => ({
        productId,
        url: image.url,
        publicId: image.publicId || null,
        altText: data.name,
        position: index,
      })),
    });
  }

  await prisma.productVariant.deleteMany({
    where: { productId },
  });

  for (const variant of data.variants) {
    await prisma.productVariant.create({
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
            reserved: 0,
          },
        },
      },
    });
  }

  await Promise.allSettled(
    removedPublicIds.map((publicId) => deleteCloudinaryImageAction(publicId)),
  );

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${productId}/edit`);
  revalidatePath("/products");
  revalidatePath(`/products/${data.slug}`);

  redirect("/admin/products");
}

export async function archiveProductAction(productId: string) {
  await requireAdmin();

  await prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      status: "ARCHIVED",
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/products");

  return {
    success: true,
    message: "Product archived successfully.",
  };
}

export async function deleteProductAction(productId: string) {
  await requireAdmin();

  const orderItem = await prisma.orderItem.findFirst({
    where: {
      productId,
    },
    select: {
      id: true,
    },
  });

  if (orderItem) {
    return {
      success: false,
      message:
        "This product has already been ordered and cannot be deleted. Archive it instead.",
    };
  }

  await prisma.product.delete({
    where: {
      id: productId,
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/products");

  return {
    success: true,
    message: "Product deleted successfully.",
  };
}

export async function deleteCloudinaryImageAction(publicId: string) {
  await requireAdmin();

  if (!publicId) {
    return { success: false, message: "Missing public ID" };
  }

  await cloudinary.uploader.destroy(publicId);

  return { success: true };
}
