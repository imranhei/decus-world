import { CategoryForm } from "@/features/admin/categories/category-form";
import { getParentCategoryOptions } from "@/server/queries/admin-category-queries";

export default async function NewCategoryPage() {
  const parentCategories = await getParentCategoryOptions();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create Category</h1>
        <p className="mt-1 text-muted-foreground">
          Add category name, parent category, image, and active status.
        </p>
      </div>

      <CategoryForm parentCategories={parentCategories} />
    </div>
  );
}