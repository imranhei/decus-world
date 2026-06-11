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

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit Product</h1>
        <p className="mt-1 text-muted-foreground">
          Update product details, variants, inventory, and images.
        </p>
      </div>

      <ProductForm product={product} categories={categories} />
    </div>
  );
}