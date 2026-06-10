import { redirect } from "next/navigation";

import { auth } from "../../../auth";
import { ShopNavbar } from "@/components/layout/shop-navbar";
import { AccountSidebar } from "@/components/layout/account-sidebar";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <>
      <ShopNavbar />

      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 md:grid-cols-[260px_1fr]">
        <AccountSidebar />

        <section>{children}</section>
      </main>
    </>
  );
}