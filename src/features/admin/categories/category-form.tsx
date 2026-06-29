"use client";

import {
  SingleImageUpload,
  type SingleImageValue,
} from "@/components/shared/single-image-upload";
import type { Category } from "@prisma/client";
import { Info } from "lucide-react";
import { useState, useTransition } from "react";

import { RequiredLabel } from "@/components/shared/required-label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
          <RequiredLabel>Name</RequiredLabel>
          <Input
            name="name"
            defaultValue={category?.name || ""}
            placeholder="Formal Shirt"
            required
          />
        </div>

        <div className="space-y-2">
          <div className="flex h-3 items-center gap-2">
            <RequiredLabel>Slug</RequiredLabel>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className="inline-flex h-4 w-4 items-center justify-center text-muted-foreground">
                    <Info className="h-3.5 w-3.5 mt-1" />
                  </div>
                </TooltipTrigger>

                <TooltipContent className="max-w-xs flex flex-col text-left">
                  <p>
                    Slug is the clean URL name of the category. It helps SEO and
                    makes category links readable.
                  </p>
                  <p className="mt-2">
                    Example: <strong>/products?category=formal-shirt</strong>
                  </p>
                  <p className="mt-2">
                    Use lowercase letters, numbers, and hyphens only. Example:
                    <strong> formal-shirt</strong>
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <Input
            name="slug"
            defaultValue={category?.slug || ""}
            placeholder="formal-shirt"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Parent Category</Label>
          <select
            name="parentId"
            defaultValue={category?.parentId || ""}
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          >
            <option value="">No parent category (Main Category)</option>

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
            placeholder="Add a short description for this category. Example: Premium formal shirts designed for office, business meetings, and special occasions."
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
