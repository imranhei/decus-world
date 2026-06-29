import { notFound } from "next/navigation";

import { ProductForm } from "@/features/admin/products/product-form";
import {
  getAdminCategories,
  getAdminProductById,
} from "@/server/queries/admin-product-queries";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    getAdminProductById(id),
    getAdminCategories(),
  ]);

  if (!product) {
    notFound();
  }

  const safeProduct = {
    ...product,
    price: Number(product.price),
    compareAtPrice: product.compareAtPrice
      ? Number(product.compareAtPrice)
      : null,
    costPrice: product.costPrice ? Number(product.costPrice) : null,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
    images: product.images.map((image) => ({
      ...image,
      createdAt: image.createdAt.toISOString(),
    })),
    variants: product.variants.map((variant) => ({
      ...variant,
      price: variant.price ? Number(variant.price) : null,
      createdAt: variant.createdAt.toISOString(),
      updatedAt: variant.updatedAt.toISOString(),
      inventory: variant.inventory
        ? {
            ...variant.inventory,
            createdAt: variant.inventory.createdAt.toISOString(),
            updatedAt: variant.inventory.updatedAt.toISOString(),
          }
        : null,
    })),
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit Product</h1>
        <p className="mt-1 text-muted-foreground">
          Update product details, variants, inventory, and images.
        </p>
      </div>

      <ProductForm product={safeProduct as any} categories={categories} />
    </div>
  );
}
