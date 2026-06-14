import Link from "next/link";
import { ShoppingBag, User } from "lucide-react";

import { auth } from "../../../auth";
import { Button } from "@/components/ui/button";

export async function ShopNavbar() {
  const session = await auth();
  console.log("Session in Navbar:", session);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold">
          Decus World
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/products" className="text-sm font-medium">
            Products
          </Link>
          <Link href="/products?category=men" className="text-sm font-medium">
            Men
          </Link>
          <Link href="/products?category=women" className="text-sm font-medium">
            Women
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Link href="/cart">
              <ShoppingBag className="h-5 w-5" />
            </Link>
          </Button>

          <Button variant="ghost" size="icon">
            <Link href={session?.user ? session?.user.role === "ADMIN" ? "/admin/dashboard" : "/account/profile" : "/login"}>
              <User className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}