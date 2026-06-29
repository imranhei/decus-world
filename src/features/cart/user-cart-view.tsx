import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { CouponForm } from "@/features/cart/coupon-form";
import { UserCartActions } from "@/features/cart/user-cart-actions";

type UserCartViewProps = {
  items: Awaited<
    ReturnType<
      typeof import("@/server/queries/cart-queries").getCurrentUserCart
    >
  >;
  appliedCoupon?: {
    code: string;
    discount: number;
  } | null;
};

export function UserCartView({ items, appliedCoupon }: UserCartViewProps) {
  const subtotal = items.reduce((total, item) => {
    return total + Number(item.product.price) * item.quantity;
  }, 0);

  const discount = appliedCoupon?.discount || 0;
  const shippingTotal = subtotal >= 3000 ? 0 : 100;
  const total = subtotal + shippingTotal - discount;

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
            <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
              {item.product.images[0] ? (
                <Image
                  src={item.product.images[0].url}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                />
              ) : null}
            </div>

            <div className="min-w-0 flex-1">
              <Link
                href={`/products/${item.product.slug}`}
                className="font-semibold hover:underline text-blue-600"
              >
                {item.product.name}
              </Link>

              <p className="text-sm text-muted-foreground">
                {item.variant?.size || "Default"}
                {item.variant?.color ? ` / ${item.variant.color}` : ""}
              </p>

              <p className="mt-1 font-medium">৳{Number(item.product.price)}</p>

              <UserCartActions cartItemId={item.id} quantity={item.quantity} />
            </div>
          </div>
        ))}
      </div>

      <aside className="h-fit rounded-xl border p-6">
        <h2 className="text-xl font-bold">Order Summary</h2>

        <div className="mt-6 space-y-3 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>৳{subtotal}</span>
          </div>

          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{shippingTotal === 0 ? "Free" : `৳${shippingTotal}`}</span>
          </div>

          <div className="flex justify-between">
            <span>Discount</span>
            <span>-৳{discount}</span>
          </div>

          <div className="flex justify-between border-t pt-3 text-lg font-bold">
            <span>Total</span>
            <span>৳{total}</span>
          </div>
        </div>

        <CouponForm
          subtotal={subtotal}
          appliedCode={appliedCoupon?.code}
          discount={discount}
        />

        <Button className="mt-6 w-full">
          <Link href="/checkout">Checkout</Link>
        </Button>
      </aside>
    </div>
  );
}
