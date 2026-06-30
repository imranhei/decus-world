import { redirect } from "next/navigation";

import { auth } from "../../../auth";
import { ShopNavbar } from "@/components/layout/shop-navbar";
import { AccountSidebar } from "@/components/layout/account-sidebar";
import { AccountMobileNav } from "@/components/layout/account-mobile-nav";

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

      <main className="px-4 py-6 md:py-8">
        <div className="grid gap-6 md:grid-cols-[250px_1fr]">
          <AccountSidebar />

          <section className="min-w-0">
            <AccountMobileNav />
            {children}
          </section>
        </div>
      </main>
    </>
  );
}