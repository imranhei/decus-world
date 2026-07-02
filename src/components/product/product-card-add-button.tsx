"use client";

import { ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/features/cart/cart-store";
import { addToCartAction } from "@/server/actions/cart-actions";

type ProductCardAddButtonProps = {
  isLoggedIn?: boolean;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    imageUrl?: string | null;
    variantId?: string | null;
    size?: string | null;
    color?: string | null;
  };
};

export function ProductCardAddButton({
  isLoggedIn = false,
  product,
}: ProductCardAddButtonProps) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);

  async function handleAdd(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();

    if (!product.variantId) {
      router.push(`/products/${product.slug}`);
      return;
    }

    if (!isLoggedIn) {
      addItem({
        productId: product.id,
        variantId: product.variantId,
        name: product.name,
        slug: product.slug,
        imageUrl: product.imageUrl,
        size: product.size,
        color: product.color,
        price: product.price,
        quantity: 1,
      });

      toast.success("Added to cart");
      router.refresh();
      return;
    }

    const result = await addToCartAction({
      productId: product.id,
      variantId: product.variantId,
      quantity: 1,
    });

    if (!result.success) {
      toast.error(result.message || "Failed to add to cart");
      return;
    }

    toast.success("Added to cart");
    router.refresh();
  }

  return (
    <Button  className="rounded-full h-10 px-6 text-sm" onClick={handleAdd}>
      <ShoppingBag className="mr-2 h-4 w-4" />
      Add to cart
    </Button>
  );
}