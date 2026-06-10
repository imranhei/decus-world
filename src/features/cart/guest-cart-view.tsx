"use client";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/features/cart/cart-store";

export function GuestCartView() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  const subtotal = items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  if (!items.length) {
    return (
      <div className="rounded-xl border p-10 text-center">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <Button className="mt-6">
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={`${item.productId}-${item.variantId}`}
            className="flex gap-4 rounded-xl border p-4"
          >
            <div className="relative h-24 w-20 overflow-hidden rounded-lg bg-muted">
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              ) : null}
            </div>

            <div className="flex-1">
              <Link href={`/products/${item.slug}`} className="font-semibold">
                {item.name}
              </Link>

              <p className="text-sm text-muted-foreground">
                {item.size} / {item.color}
              </p>

              <p className="mt-1 font-medium">৳{item.price}</p>

              <div className="mt-3 flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    updateQuantity(item.productId, item.variantId, item.quantity - 1)
                  }
                >
                  -
                </Button>

                <span className="w-8 text-center">{item.quantity}</span>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    updateQuantity(item.productId, item.variantId, item.quantity + 1)
                  }
                >
                  +
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeItem(item.productId, item.variantId)}
                >
                  Remove
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <aside className="rounded-xl border p-6">
        <h2 className="text-xl font-bold">Order Summary</h2>

        <div className="mt-6 flex justify-between">
          <span>Subtotal</span>
          <span className="font-bold">৳{subtotal}</span>
        </div>

        <Button className="mt-6 w-full">
          <Link href="/login">Login to Checkout</Link>
        </Button>
      </aside>
    </div>
  );
}