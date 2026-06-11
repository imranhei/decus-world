import { GuestCartView } from "@/features/cart/guest-cart-view";
import { UserCartView } from "@/features/cart/user-cart-view";
import { getAppliedCoupon } from "@/server/actions/coupon-actions";
import { getCurrentUserCart } from "@/server/queries/cart-queries";
import { auth } from "../../../../auth";

export const metadata = {
  title: "Cart",
  description: "View your shopping cart.",
};

export default async function CartPage() {
  const session = await auth();

  if (!session?.user) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="mb-8 text-3xl font-bold">Shopping Cart</h1>
        <GuestCartView />
      </main>
    );
  }

  const cartItems = await getCurrentUserCart();

  const subtotal = cartItems.reduce((total, item) => {
    return total + Number(item.product.price) * item.quantity;
  }, 0);

  const appliedCoupon = await getAppliedCoupon(subtotal);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="mb-8 text-3xl font-bold">Shopping Cart</h1>
      <UserCartView
        items={cartItems}
        appliedCoupon={
          appliedCoupon
            ? {
                code: appliedCoupon.coupon.code,
                discount: appliedCoupon.discount,
              }
            : null
        }
      />
    </main>
  );
}
