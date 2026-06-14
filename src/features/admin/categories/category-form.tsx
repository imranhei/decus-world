"use client";

import {
  SingleImageUpload,
  type SingleImageValue,
} from "@/components/shared/single-image-upload";
import type { Category } from "@prisma/client";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createCategoryAction,
  updateCategoryAction,
} from "@/server/actions/admin-category-actions";

type CategoryFormProps = {
  category?: Category;
  parentCategories: Category[];
};

export function CategoryForm({
  category,
  parentCategories,
}: CategoryFormProps) {
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const [image, setImage] = useState<SingleImageValue | null>(
    category?.imageUrl
      ? {
          url: category.imageUrl,
          publicId: category.imagePublicId || undefined,
        }
      : null,
  );

  function handleSubmit(formData: FormData) {
    setError("");

    const values = {
      name: formData.get("name"),
      slug: formData.get("slug"),
      description: formData.get("description"),
      image,
      parentId: formData.get("parentId") || undefined,
      isActive: formData.get("isActive") === "on",
    };

    startTransition(async () => {
      const result = category
        ? await updateCategoryAction(category.id, values)
        : await createCategoryAction(values);

      if (result && !result.success) {
        setError(result.message);
      }
    });
  }

  return (
    <form
      action={handleSubmit}
      className="space-y-6 rounded-xl border bg-background p-6"
    >
      {error ? <p className="text-sm text-red-500">{error}</p> : null}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Name</Label>
          <Input name="name" defaultValue={category?.name || ""} required />
        </div>

        <div className="space-y-2">
          <Label>Slug</Label>
          <Input name="slug" defaultValue={category?.slug || ""} required />
        </div>

        <div className="space-y-2">
          <Label>Parent Category</Label>
          <select
            name="parentId"
            defaultValue={category?.parentId || ""}
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          >
            <option value="">No parent category</option>

            {parentCategories.map((parent) => (
              <option key={parent.id} value={parent.id}>
                {parent.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Category Image</Label>
          <SingleImageUpload
            value={image}
            onChange={setImage}
            folder="decus-world/categories"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Description</Label>
          <textarea
            name="description"
            defaultValue={category?.description || ""}
            className="min-h-28 w-full rounded-md border bg-background px-3 py-2 text-sm"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          name="isActive"
          type="checkbox"
          defaultChecked={category?.isActive ?? true}
        />
        Active category
      </label>

      <Button disabled={isPending} type="submit">
        {isPending
          ? "Saving..."
          : category
            ? "Update Category"
            : "Create Category"}
      </Button>
    </form>
  );
}
