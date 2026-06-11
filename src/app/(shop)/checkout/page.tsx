import { redirect } from "next/navigation";

import { CheckoutForm } from "@/features/checkout/checkout-form";
import { prisma } from "@/lib/prisma";
import { getAppliedCoupon } from "@/server/actions/coupon-actions";
import { getCurrentUserCart } from "@/server/queries/cart-queries";
import { auth } from "../../../../auth";

export const metadata = {
  title: "Checkout",
};

export default async function CheckoutPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const [cartItems, user] = await Promise.all([
    getCurrentUserCart(),
    prisma.user.findUnique({
      where: { id: session.user.id },
    }),
  ]);

  if (!cartItems.length) {
    redirect("/cart");
  }

  const subtotal = cartItems.reduce((total, item) => {
    return total + Number(item.product.price) * item.quantity;
  }, 0);

  const appliedCoupon = await getAppliedCoupon(subtotal);
  const discountTotal = appliedCoupon?.discount || 0;
  const shippingTotal = subtotal >= 3000 ? 0 : 100;
  const total = subtotal + shippingTotal - discountTotal;

  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-4 py-10 lg:grid-cols-[1fr_360px]">
      <CheckoutForm
        defaultValues={{
          customerName: user?.name || "",
          customerEmail: user?.email || "",
          customerPhone: user?.phone,
          shippingAddress: user?.address,
          shippingCity: user?.city,
          shippingPostalCode: user?.postalCode,
        }}
      />

      <aside className="h-fit rounded-xl border p-6">
        <h2 className="text-xl font-bold">Order Summary</h2>

        <div className="mt-6 space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between gap-4 text-sm">
              <span>
                {item.product.name} × {item.quantity}
              </span>
              <span>৳{Number(item.product.price) * item.quantity}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-3 border-t pt-6 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>৳{subtotal}</span>
          </div>

          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{shippingTotal === 0 ? "Free" : `৳${shippingTotal}`}</span>
          </div>

          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>৳{total}</span>
          </div>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          Payment method: Cash on Delivery
        </p>
      </aside>

      {appliedCoupon ? (
        <p className="mt-3 text-xs text-muted-foreground">
          Coupon applied: {appliedCoupon.coupon.code}
        </p>
      ) : null}
    </main>
  );
}
