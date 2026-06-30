"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { AddToCartButton } from "@/features/cart/add-to-cart-button";
import { cn } from "@/lib/utils";

type Variant = {
  id: string;
  size: string | null;
  color: string | null;
  inventory:
    | {
        quantity: number;
        reserved: number;
      }
    | null;
};

type ProductPurchasePanelProps = {
  isLoggedIn: boolean;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    imageUrl?: string | null;
    variants: Variant[];
  };
};

export function ProductPurchasePanel({
  isLoggedIn,
  product,
}: ProductPurchasePanelProps) {
  const router = useRouter();

  const variants = product.variants.map((variant) => ({
    id: variant.id,
    size: variant.size,
    color: variant.color,
    inventory: variant.inventory
      ? {
          quantity: variant.inventory.quantity,
          reserved: variant.inventory.reserved ?? 0,
        }
      : null,
  }));

  const sizes = useMemo(
    () => [...new Set(variants.map((v) => v.size).filter(Boolean))],
    [variants],
  );

  const colors = useMemo(
    () => [...new Set(variants.map((v) => v.color).filter(Boolean))],
    [variants],
  );

  const [selectedSize, setSelectedSize] = useState<string | null>(
    sizes[0] || null,
  );

  const [selectedColor, setSelectedColor] = useState<string | null>(
    colors[0] || null,
  );

  const [quantity, setQuantity] = useState(1);

  const selectedVariant =
    variants.find((variant) => {
      const sizeMatch = sizes.length ? variant.size === selectedSize : true;
      const colorMatch = colors.length ? variant.color === selectedColor : true;

      return sizeMatch && colorMatch;
    }) || variants[0];

  const availableQuantity = selectedVariant?.inventory?.quantity || 0;
  const isOutOfStock = availableQuantity <= 0;

  function decreaseQuantity() {
    setQuantity((current) => Math.max(1, current - 1));
  }

  function increaseQuantity() {
    setQuantity((current) => {
      if (availableQuantity && current >= availableQuantity) return current;
      return current + 1;
    });
  }

  function handleBuyNow() {
    if (!selectedVariant) {
      toast.error("Please select a size");
      return;
    }

    router.push(
      `/checkout?buyNowProduct=${product.id}&variant=${selectedVariant.id}&quantity=${quantity}`,
    );
  }

  return (
    <div className="mt-6 space-y-6">
      {sizes.length ? (
        <div>
          <p className="mb-2 text-sm font-semibold">Size</p>

          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => {
                  setSelectedSize(size);
                  setQuantity(1);
                }}
                className={cn(
                  "min-w-12 rounded-md border px-4 py-2 text-sm font-medium transition",
                  selectedSize === size
                    ? "border-black bg-black text-white"
                    : "border-border hover:border-black",
                )}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {colors.length ? (
        <div>
          <p className="mb-2 text-sm font-semibold">Color</p>

          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => {
                  setSelectedColor(color);
                  setQuantity(1);
                }}
                className={cn(
                  "rounded-md border px-4 py-2 text-xs font-bold uppercase transition",
                  selectedColor === color
                    ? "border-black bg-black text-white"
                    : "border-border hover:border-black",
                )}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div>
        <p className="mb-2 text-sm text-muted-foreground">Quantity</p>

        <div className="flex h-12 w-36 items-center border">
          <button
            type="button"
            onClick={decreaseQuantity}
            className="flex h-full flex-1 items-center justify-center text-lg"
          >
            -
          </button>

          <span className="flex h-full flex-1 items-center justify-center">
            {quantity}
          </span>

          <button
            type="button"
            onClick={increaseQuantity}
            className="flex h-full flex-1 items-center justify-center text-lg"
          >
            +
          </button>
        </div>

        <p className="mt-2 text-xs text-muted-foreground">
          Stock available: {availableQuantity}
        </p>
      </div>

      <div className="space-y-3">
        <AddToCartButton
          isLoggedIn={isLoggedIn}
          quantity={quantity}
          selectedVariantId={selectedVariant?.id}
          product={{
            id: product.id,
            name: product.name,
            slug: product.slug,
            price: product.price,
            imageUrl: product.imageUrl,
            variants,
          }}
        />

        <Button
          type="button"
          disabled={isOutOfStock}
          onClick={handleBuyNow}
          className="h-14 w-full rounded-none bg-black text-white hover:bg-black/90"
        >
          <ShoppingBag className="mr-2 h-4 w-4" />
          Buy it now
        </Button>
      </div>
    </div>
  );
}