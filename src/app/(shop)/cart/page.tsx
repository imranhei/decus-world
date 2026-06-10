import { auth } from "../../../../auth";
import { GuestCartView } from "@/features/cart/guest-cart-view";
import { UserCartView } from "@/features/cart/user-cart-view";
import { getCurrentUserCart } from "@/server/queries/cart-queries";

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

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="mb-8 text-3xl font-bold">Shopping Cart</h1>
      <UserCartView items={cartItems} />
    </main>
  );
}