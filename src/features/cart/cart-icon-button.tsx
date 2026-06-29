"use client";

import { ShoppingBag } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/features/cart/cart-store";

type CartIconButtonProps = {
  serverCount?: number;
  isLoggedIn: boolean;
};

export function CartIconButton({
  serverCount = 0,
  isLoggedIn,
}: CartIconButtonProps) {
  const guestItems = useCartStore((state) => state.items);

  const guestCount = guestItems.reduce((total, item) => {
    return total + item.quantity;
  }, 0);

  const count = isLoggedIn ? serverCount : guestCount;

  return (
    <Button variant="ghost" size="icon" className="relative">
      <Link href="/cart">
        <ShoppingBag className="h-5 w-5" />

        {count > 0 ? (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1 text-[10px] text-white">
            {count}
          </span>
        ) : null}
      </Link>
    </Button>
  );
}
