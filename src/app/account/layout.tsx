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

      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-6 md:grid-cols-[250px_1fr]">
          <AccountSidebar />

          <section className="min-w-0">{children}</section>
        </div>
      </main>
    </>
  );
}