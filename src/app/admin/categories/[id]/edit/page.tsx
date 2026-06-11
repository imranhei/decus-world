import { notFound } from "next/navigation";

import { CategoryForm } from "@/features/admin/categories/category-form";
import {
  getCategoryById,
  getParentCategoryOptions,
} from "@/server/queries/admin-category-queries";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditCategoryPage({ params }: PageProps) {
  const { id } = await params;

  const [category, parentCategories] = await Promise.all([
    getCategoryById(id),
    getParentCategoryOptions(id),
  ]);

  if (!category) {
    notFound();
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit Category</h1>
        <p className="mt-1 text-muted-foreground">
          Update category information and active status.
        </p>
      </div>

      <CategoryForm category={category} parentCategories={parentCategories} />
    </div>
  );
}