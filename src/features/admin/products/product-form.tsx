"use client";

import type {
  Category,
  Inventory,
  Product,
  ProductImage,
  ProductVariant,
} from "@prisma/client";
import { useState, useTransition } from "react";
import {
  ProductImageManager,
  type ProductImageInput,
} from "./product-image-manager";

import { InfoTooltip } from "@/components/shared/info-tooltip";
import { RequiredLabel } from "@/components/shared/required-label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createProductAction,
  updateProductAction,
} from "@/server/actions/admin-product-actions";
import { Trash } from "lucide-react";

type ProductFormProps = {
  categories: Category[];
  product?: Product & {
    images: ProductImage[];
    variants: Array<ProductVariant & { inventory: Inventory | null }>;
  };
};

type ProductFormVariant = {
  size: string;
  color: string;
  sku: string;
  quantity: number;
};

export function ProductForm({ categories, product }: ProductFormProps) {
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isSaved, setIsSaved] = useState(false);

  const [variants, setVariants] = useState<ProductFormVariant[]>(
    product?.variants.length
      ? product.variants.map((variant) => ({
          size: variant.size || "",
          color: variant.color || "",
          sku: variant.sku || "",
          quantity: variant.inventory?.quantity || 0,
        }))
      : [
          {
            size: "",
            color: "",
            sku: "",
            quantity: 0,
          },
        ],
  );

  const [images, setImages] = useState<ProductImageInput[]>(
    product?.images.map((image) => ({
      url: image.url,
      publicId: image.publicId || undefined,
    })) || [],
  );

  function addVariantRow() {
    setVariants((prev) => [
      ...prev,
      {
        size: "",
        color: "",
        sku: "",
        quantity: 0,
      },
    ]);
  }

  function removeVariantRow(index: number) {
    setVariants((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
  }

  function updateVariantRow(
    index: number,
    field: keyof ProductFormVariant,
    value: string | number,
  ) {
    setVariants((prev) =>
      prev.map((variant, itemIndex) =>
        itemIndex === index
          ? {
              ...variant,
              [field]: value,
            }
          : variant,
      ),
    );
  }

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
      variants,
      isFeatured: formData.get("isFeatured") === "on",
      isNewArrival: formData.get("isNewArrival") === "on",
      isBestSeller: formData.get("isBestSeller") === "on",
      metaTitle: formData.get("metaTitle"),
      metaDescription: formData.get("metaDescription"),
    };

    startTransition(async () => {
      setIsSaved(true);

      const result = product
        ? await updateProductAction(product.id, values)
        : await createProductAction(values);

      if (result && !result.success) {
        setIsSaved(false);
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
            defaultValue={product?.name || ""}
            placeholder="Formal Black Shirt"
            required
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 h-3">
            <RequiredLabel>Slug</RequiredLabel>

            <InfoTooltip>
              <p>
                Slug is the clean URL name of the product. It helps SEO and
                makes product links readable.
              </p>
              <p className="mt-2">
                Example web address:{" "}
                <strong>
                  (BaseURL)/products/mens-blue-cotton-formal-shirt
                </strong>
              </p>
              <p className="mt-2">
                Use lowercase letters, numbers, and hyphens only. Example:
                <strong> mens-blue-cotton-formal-shirt</strong>
              </p>
            </InfoTooltip>
          </div>

          <Input
            name="slug"
            defaultValue={product?.slug || ""}
            placeholder="mens-blue-cotton-formal-shirt"
            required
          />
        </div>

        <div className="space-y-2">
          <RequiredLabel>Category</RequiredLabel>
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
          <RequiredLabel>Price</RequiredLabel>
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
          <div className="flex h-5 items-center gap-1.5">
            <Label className="leading-none">Base SKU</Label>

            <InfoTooltip>
              <p>
                Base SKU is the main product code used for inventory, tracking,
                and internal identification.
              </p>
              <p className="mt-2">
                Variant SKUs can be generated from this base code with
                size/color.
              </p>
              <p className="mt-2">
                Example: <strong>FSHIRT-BLACK</strong> →{" "}
                <strong>FSHIRT-BLACK-M</strong>, <strong>FSHIRT-BLACK-L</strong>
              </p>
            </InfoTooltip>
          </div>

          <Input
            name="sku"
            defaultValue={product?.sku || ""}
            placeholder="FSHIRT-BLACK"
          />
        </div>

        <div className="space-y-4 md:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <Label>Variants & Inventory</Label>
              <p className="text-xs text-muted-foreground">
                Add each size/color with its own stock quantity.
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={addVariantRow}
              className="h-8 rounded-full px-4 text-sm"
            >
              Add Variant
            </Button>
          </div>

          <div className="space-y-3">
            {variants.map((variant, index) => (
              <div
                key={index}
                className="grid gap-3 rounded-xl border p-4 md:grid-cols-[1fr_1fr_1fr_120px_auto]"
              >
                <div className="space-y-2">
                  <Label>Size</Label>
                  <Input
                    value={variant.size}
                    placeholder="M"
                    onChange={(event) =>
                      updateVariantRow(index, "size", event.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Color</Label>
                  <Input
                    value={variant.color}
                    placeholder="Black"
                    onChange={(event) =>
                      updateVariantRow(index, "color", event.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center">
                    SKU{" "}
                    <span className="text-xs text-muted-foreground h-3">
                      (optional)
                    </span>
                  </Label>
                  <Input
                    value={variant.sku}
                    placeholder="FSS-1234"
                    onChange={(event) =>
                      updateVariantRow(index, "sku", event.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    min={0}
                    value={variant.quantity}
                    onChange={(event) =>
                      updateVariantRow(
                        index,
                        "quantity",
                        Number(event.target.value),
                      )
                    }
                  />
                </div>

                <div className="flex items-end ">
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    disabled={variants.length === 1}
                    onClick={() => removeVariantRow(index)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Short Description</Label>
          <Input
            name="shortDescription"
            defaultValue={product?.shortDescription || ""}
            placeholder="Formal Black Shirt"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <RequiredLabel>Description</RequiredLabel>
          <textarea
            name="description"
            defaultValue={product?.description || ""}
            placeholder="Classic and comfortable men's formal shirt made with premium cotton fabric. Designed for office, business meetings, and formal occasions. Soft feel, breathable fabric, and modern fit for everyday confidence."
            className="min-h-32 w-full rounded-md border bg-background px-3 py-2 text-sm"
            required
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Product Images</Label>
          <ProductImageManager
            images={images}
            onChange={setImages}
            isSaved={isSaved}
          />
        </div>

        <div className="space-y-2">
          <Label>Meta Title</Label>
          <Input
            name="metaTitle"
            defaultValue={product?.metaTitle || ""}
            placeholder="Men's Blue Cotton Formal Shirt | Decus World"
          />
        </div>

        <div className="space-y-2">
          <Label>Meta Description</Label>
          <Input
            name="metaDescription"
            defaultValue={product?.metaDescription || ""}
            placeholder="Shop men's blue cotton formal shirt from Decus World. Premium fabric, modern fit, and comfortable style for office and formal wear."
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

      <Button
        disabled={isPending}
        type="submit"
        className="h-10 rounded-full px-6 text-sm"
      >
        {isPending
          ? "Saving..."
          : product
            ? "Update Product"
            : "Create Product"}
      </Button>
    </form>
  );
}
