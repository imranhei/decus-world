import { auth } from "../../../auth";
import { ShopNavbar } from "@/components/layout/shop-navbar";
import { CartSync } from "@/features/cart/cart-sync";

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <>
      <CartSync isLoggedIn={Boolean(session?.user)} />
      <ShopNavbar />
      {children}
    </>
  );
}