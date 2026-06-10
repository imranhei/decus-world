"use client";

import { useEffect, useRef, useTransition } from "react";

import { syncGuestCartAction } from "@/server/actions/cart-actions";
import { useCartStore } from "@/features/cart/cart-store";

export function CartSync({ isLoggedIn }: { isLoggedIn: boolean }) {
  const hasSynced = useRef(false);
  const [isPending, startTransition] = useTransition();

  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    if (!isLoggedIn) return;
    if (hasSynced.current) return;
    if (!items.length) return;

    hasSynced.current = true;

    startTransition(async () => {
      const result = await syncGuestCartAction(
        items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
        }))
      );

      if (result.success) {
        clearCart();
      }
    });
  }, [isLoggedIn, items, clearCart]);

  return null;
}