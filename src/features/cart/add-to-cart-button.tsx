"use client";

import { ShoppingBag } from "lucide-react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/features/cart/cart-store";
import { addToCartAction } from "@/server/actions/cart-actions";

type Variant = {
  id: string;
  size: string | null;
  color: string | null;
  inventory:
    | {
        quantity: number;
        reserved: number;
      }
    | null
    | undefined;
};

type AddToCartButtonProps = {
  isLoggedIn: boolean;
  quantity?: number;
  selectedVariantId?: string | null;
  showVariantSelector?: boolean;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    imageUrl?: string | null;
    variants: Variant[];
  };
};

export function AddToCartButton({
  isLoggedIn,
  product,
  quantity = 1,
  selectedVariantId,
  showVariantSelector = false,
}: AddToCartButtonProps) {
  const router = useRouter();
  const [localSelectedVariantId, setLocalSelectedVariantId] = useState(
    selectedVariantId || product.variants[0]?.id || null,
  );

  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const addItem = useCartStore((state) => state.addItem);

  const finalVariantId = selectedVariantId || localSelectedVariantId;

  const selectedVariant = product.variants.find(
    (variant) => variant.id === finalVariantId,
  );

  function handleAddToCart() {
    setError("");

    if (!selectedVariant) {
      setError("Please select a variant");
      toast.error("Please select a variant");
      return;
    }

    const availableStock =
      (selectedVariant.inventory?.quantity || 0) -
      (selectedVariant.inventory?.reserved || 0);

    if (availableStock <= 0) {
      setError("This item is out of stock");
      toast.error("This item is out of stock");
      return;
    }

    if (quantity > availableStock) {
      setError(`Only ${availableStock} item(s) available`);
      toast.error(`Only ${availableStock} item(s) available`);
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
        quantity,
      });

      toast.success("Added to cart");
      router.refresh();
      return;
    }

    startTransition(async () => {
      const result = await addToCartAction({
        productId: product.id,
        variantId: selectedVariant.id,
        quantity,
      });

      if (!result.success) {
        toast.error(result.message);
        setError(result.message);
        return;
      }

      toast.success("Added to cart");
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      {showVariantSelector ? (
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
                  variant={
                    localSelectedVariantId === variant.id ? "default" : "outline"
                  }
                  disabled={availableStock <= 0}
                  onClick={() => setLocalSelectedVariantId(variant.id)}
                >
                  {variant.size || "Default"}
                  {variant.color ? ` / ${variant.color}` : ""}
                </Button>
              );
            })}
          </div>
        </div>
      ) : null}

      {error ? <p className="text-sm text-red-500">{error}</p> : null}

      <Button
        type="button"
        size="lg"
        className="h-10 w-full"
        disabled={isPending}
        onClick={handleAddToCart}
      >
        <ShoppingBag className="mr-2 h-5 w-5" />
        {isPending ? "Adding..." : "Add to Cart"}
      </Button>
    </div>
  );
}