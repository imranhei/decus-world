import { ProductForm } from "@/features/admin/products/product-form";
import { getAdminCategories } from "@/server/queries/admin-product-queries";

export default async function NewProductPage() {
  const categories = await getAdminCategories();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create Product</h1>
        <p className="mt-1 text-muted-foreground">
          Add product images, variants, and inventory.
        </p>
      </div>

      <ProductForm categories={categories} />
    </div>
  );
}