import { ShopNavbar } from "@/components/layout/shop-navbar";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ShopNavbar />
      {children}
    </>
  );
}