"use client";

import { useState, useTransition } from "react";
import { ShoppingBag } from "lucide-react";

import { addToCartAction } from "@/server/actions/cart-actions";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/features/cart/cart-store";

type Variant = {
  id: string;
  size: string | null;
  color: string | null;
  inventory?: {
    quantity: number;
    reserved: number;
  } | null;
};

type AddToCartButtonProps = {
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

export function AddToCartButton({ isLoggedIn, product }: AddToCartButtonProps) {
  const [selectedVariantId, setSelectedVariantId] = useState(
    product.variants[0]?.id || null
  );
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const addItem = useCartStore((state) => state.addItem);

  const selectedVariant = product.variants.find(
    (variant) => variant.id === selectedVariantId
  );

  function handleAddToCart() {
    setError("");

    if (!selectedVariant) {
      setError("Please select a variant");
      return;
    }

    const availableStock =
      (selectedVariant.inventory?.quantity || 0) -
      (selectedVariant.inventory?.reserved || 0);

    if (availableStock <= 0) {
      setError("This item is out of stock");
      return;
    }

    if (!isLoggedIn) {
      addItem({
        productId: product.id,
        variantId: selectedVariant.id,
        name: product.name,
        slug: product.slug,
        imageUrl: product.imageUrl,
        size: selectedVariant.size,
        color: selectedVariant.color,
        price: product.price,
        quantity: 1,
      });

      return;
    }

    startTransition(async () => {
      const result = await addToCartAction({
        productId: product.id,
        variantId: selectedVariant.id,
        quantity: 1,
      });

      if (!result.success) {
        setError(result.message);
      }
    });
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-sm font-medium">Choose Variant</p>

        <div className="flex flex-wrap gap-2">
          {product.variants.map((variant) => {
            const availableStock =
              (variant.inventory?.quantity || 0) -
              (variant.inventory?.reserved || 0);

            return (
              <Button
                key={variant.id}
                type="button"
                variant={selectedVariantId === variant.id ? "default" : "outline"}
                disabled={availableStock <= 0}
                onClick={() => setSelectedVariantId(variant.id)}
              >
                {variant.size} / {variant.color}
              </Button>
            );
          })}
        </div>
      </div>

      {error ? <p className="text-sm text-red-500">{error}</p> : null}

      <Button
        type="button"
        size="lg"
        className="w-full"
        disabled={isPending}
        onClick={handleAddToCart}
      >
        <ShoppingBag className="mr-2 h-5 w-5" />
        {isPending ? "Adding..." : "Add to Cart"}
      </Button>
    </div>
  );
}