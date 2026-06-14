"use client";

import type {
  Category,
  Inventory,
  Product,
  ProductImage,
  ProductVariant,
} from "@prisma/client";
import { useState, useTransition } from "react";
import { ProductImageManager, type ProductImageInput } from "./product-image-manager";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createProductAction,
  updateProductAction,
} from "@/server/actions/admin-product-actions";

type ProductFormProps = {
  categories: Category[];
  product?: Product & {
    images: ProductImage[];
    variants: Array<ProductVariant & { inventory: Inventory | null }>;
  };
};

export function ProductForm({ categories, product }: ProductFormProps) {
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const [images, setImages] = useState<ProductImageInput[]>(
    product?.images.map((image) => ({
      url: image.url,
      publicId: image.publicId || undefined,
    })) || [],
  );

  function handleSubmit(formData: FormData) {
    setError("");

    const values = {
      name: formData.get("name"),
      slug: formData.get("slug"),
      description: formData.get("description"),
      shortDescription: formData.get("shortDescription"),
      categoryId: formData.get("categoryId"),
      price: formData.get("price"),
      compareAtPrice: formData.get("compareAtPrice") || undefined,
      sku: formData.get("sku"),
      status: formData.get("status"),
      images,
      sizes: formData.get("sizes"),
      colors: formData.get("colors"),
      inventoryQuantity: formData.get("inventoryQuantity"),
      isFeatured: formData.get("isFeatured") === "on",
      isNewArrival: formData.get("isNewArrival") === "on",
      isBestSeller: formData.get("isBestSeller") === "on",
      metaTitle: formData.get("metaTitle"),
      metaDescription: formData.get("metaDescription"),
    };

    startTransition(async () => {
      const result = product
        ? await updateProductAction(product.id, values)
        : await createProductAction(values);

      if (result && !result.success) {
        setError(result.message);
      }
    });
  }

  const defaultImageUrls =
    product?.images.map((image) => image.url).join(", ") || "";
  const defaultSizes = [
    ...new Set(
      product?.variants.map((variant) => variant.size).filter(Boolean),
    ),
  ].join(", ");
  const defaultColors = [
    ...new Set(
      product?.variants.map((variant) => variant.color).filter(Boolean),
    ),
  ].join(", ");

  const defaultInventory = product?.variants[0]?.inventory?.quantity || 0;

  return (
    <form
      action={handleSubmit}
      className="space-y-6 rounded-xl border bg-background p-6"
    >
      {error ? <p className="text-sm text-red-500">{error}</p> : null}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Name</Label>
          <Input name="name" defaultValue={product?.name || ""} required />
        </div>

        <div className="space-y-2">
          <Label>Slug</Label>
          <Input name="slug" defaultValue={product?.slug || ""} required />
        </div>

        <div className="space-y-2">
          <Label>Category</Label>
          <select
            name="categoryId"
            defaultValue={product?.categoryId || ""}
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            required
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label>Status</Label>
          <select
            name="status"
            defaultValue={product?.status || "DRAFT"}
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          >
            <option value="DRAFT">DRAFT</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="ARCHIVED">ARCHIVED</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label>Price</Label>
          <Input
            name="price"
            type="number"
            defaultValue={Number(product?.price || 0)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Compare Price</Label>
          <Input
            name="compareAtPrice"
            type="number"
            defaultValue={Number(product?.compareAtPrice || 0)}
          />
        </div>

        <div className="space-y-2">
          <Label>Base SKU</Label>
          <Input name="sku" defaultValue={product?.sku || ""} />
        </div>

        <div className="space-y-2">
          <Label>Inventory Quantity</Label>
          <Input
            name="inventoryQuantity"
            type="number"
            defaultValue={defaultInventory}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Short Description</Label>
          <Input
            name="shortDescription"
            defaultValue={product?.shortDescription || ""}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Description</Label>
          <textarea
            name="description"
            defaultValue={product?.description || ""}
            className="min-h-32 w-full rounded-md border bg-background px-3 py-2 text-sm"
            required
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Product Images</Label>
          <ProductImageManager images={images} onChange={setImages} />
        </div>

        <div className="space-y-2">
          <Label>Sizes</Label>
          <Input
            name="sizes"
            defaultValue={defaultSizes}
            placeholder="S, M, L, XL"
          />
        </div>

        <div className="space-y-2">
          <Label>Colors</Label>
          <Input
            name="colors"
            defaultValue={defaultColors}
            placeholder="Black, White, Blue"
          />
        </div>

        <div className="space-y-2">
          <Label>Meta Title</Label>
          <Input name="metaTitle" defaultValue={product?.metaTitle || ""} />
        </div>

        <div className="space-y-2">
          <Label>Meta Description</Label>
          <Input
            name="metaDescription"
            defaultValue={product?.metaDescription || ""}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input
            name="isFeatured"
            type="checkbox"
            defaultChecked={product?.isFeatured}
          />
          Featured
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            name="isNewArrival"
            type="checkbox"
            defaultChecked={product?.isNewArrival}
          />
          New Arrival
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            name="isBestSeller"
            type="checkbox"
            defaultChecked={product?.isBestSeller}
          />
          Best Seller
        </label>
      </div>

      <Button disabled={isPending} type="submit">
        {isPending
          ? "Saving..."
          : product
            ? "Update Product"
            : "Create Product"}
      </Button>
    </form>
  );
}
