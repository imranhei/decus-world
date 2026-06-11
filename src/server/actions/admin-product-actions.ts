"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validations/product";
import { auth } from "../../../auth";
import { cloudinary } from "@/lib/cloudinary";

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

function buildVariants({
  slug,
  sizes,
  colors,
  inventoryQuantity,
}: {
  slug: string;
  sizes: string[];
  colors: string[];
  inventoryQuantity: number;
}) {
  const safeSizes = sizes.length ? sizes : ["Default"];
  const safeColors = colors.length ? colors : ["Default"];

  return safeSizes.flatMap((size) =>
    safeColors.map((color) => ({
      size,
      color,
      sku: `${slug}-${size}-${color}`.toUpperCase(),
      inventory: {
        create: {
          quantity: inventoryQuantity,
        },
      },
    })),
  );
}

export async function createProductAction(values: unknown) {
  await requireAdmin();

  const parsed = productSchema.safeParse(values);

  if (!parsed.success) {
    return { success: false, message: "Invalid product data" };
  }

  const data = parsed.data;

  const sizes = splitValues(data.sizes);
  const colors = splitValues(data.colors);

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
        create: buildVariants({
          slug: data.slug,
          sizes,
          colors,
          inventoryQuantity: data.inventoryQuantity,
        }),
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

  const sizes = splitValues(data.sizes);
  const colors = splitValues(data.colors);

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

    for (const size of sizes) {
      const variantColors = colors.length ? colors : [null];

      for (const color of variantColors) {
        await tx.productVariant.create({
          data: {
            productId,
            size,
            color,
            sku: `${data.slug}-${size}-${color || "DEFAULT"}`.toUpperCase(),
            inventory: {
              create: {
                quantity: data.inventoryQuantity,
              },
            },
          },
        });
      }
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