import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  removeCartItemAction,
  updateCartItemQuantityAction,
} from "@/server/actions/cart-actions";

type UserCartViewProps = {
  items: Awaited<
    ReturnType<
      typeof import("@/server/queries/cart-queries").getCurrentUserCart
    >
  >;
};

export function UserCartView({ items }: UserCartViewProps) {
  const subtotal = items.reduce((total, item) => {
    return total + Number(item.product.price) * item.quantity;
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
          <div key={item.id} className="flex gap-4 rounded-xl border p-4">
            <div className="relative h-24 w-20 overflow-hidden rounded-lg bg-muted">
              {item.product.images[0] ? (
                <Image
                  src={item.product.images[0].url}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                />
              ) : null}
            </div>

            <div className="flex-1">
              <Link
                href={`/products/${item.product.slug}`}
                className="font-semibold"
              >
                {item.product.name}
              </Link>

              <p className="text-sm text-muted-foreground">
                {item.variant?.size} / {item.variant?.color}
              </p>

              <p className="mt-1 font-medium">৳{Number(item.product.price)}</p>

              <div className="mt-3 flex items-center gap-2">
                <form
                  action={async () => {
                    "use server";

                    await updateCartItemQuantityAction({
                      cartItemId: item.id,
                      quantity: item.quantity - 1,
                    });
                  }}
                >
                  <Button size="sm" variant="outline">
                    -
                  </Button>
                </form>

                <span className="w-8 text-center">{item.quantity}</span>

                <form
                  action={async () => {
                    "use server";

                    await updateCartItemQuantityAction({
                      cartItemId: item.id,
                      quantity: item.quantity + 1,
                    });
                  }}
                >
                  <Button size="sm" variant="outline">
                    +
                  </Button>
                </form>

                <form
                  action={async () => {
                    "use server";

                    await removeCartItemAction(item.id);
                  }}
                >
                  <Button size="sm" variant="ghost">
                    Remove
                  </Button>
                </form>
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
          <Link href="/checkout">Checkout</Link>
        </Button>
      </aside>
    </div>
  );
}
