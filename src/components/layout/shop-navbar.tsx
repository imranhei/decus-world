import { LogOut, Menu, User } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CartIconButton } from "@/features/cart/cart-icon-button";
import { logoutAction } from "@/server/actions/auth-actions";
import { getCurrentUserCartCount } from "@/server/queries/cart-queries";
import { auth } from "../../../auth";

const navLinks = [
  { title: "Products", href: "/products" },
  { title: "Men", href: "/products?category=men" },
  { title: "Women", href: "/products?category=women" },
  { title: "Our Story", href: "/our-story" },
];

export async function ShopNavbar() {
  const session = await auth();
  const cartCount = session?.user ? await getCurrentUserCartCount() : 0;

  const accountHref = session?.user
    ? session.user.role === "ADMIN" || session.user.role === "STAFF"
      ? "/admin/dashboard"
      : "/account/profile"
    : "/login";

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between gap-3 px-4">
        <Link href="/" className="text-xl font-bold">
          Decus World
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium"
            >
              {item.title}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <CartIconButton
            serverCount={cartCount}
            isLoggedIn={Boolean(session?.user)}
          />

          <Button variant="ghost" size="icon">
            <Link href={accountHref}>
              <User className="h-5 w-5" />
            </Link>
          </Button>

          {session?.user ? (
            <form action={logoutAction} className="hidden md:block">
              <Button variant="ghost" size="icon" type="submit">
                <LogOut className="h-5 w-5" />
              </Button>
            </form>
          ) : null}

          <Sheet>
            <SheetTrigger>
              <div className="md:hidden p-1.5 hover:bg-muted rounded-md cursor-pointer">
                <Menu className="size-4" />
              </div>
            </SheetTrigger>

            <SheetContent side="right" className="flex w-60! flex-col">
              <SheetHeader className="space-y-0 border-b pb-4">
                <SheetTitle className="text-base font-semibold">
                  Decus World
                </SheetTitle>
              </SheetHeader>

              <nav className="mt-0 space-y-1 px-4">
                {navLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block rounded-xl px-3 py-2 text-sm font-medium hover:bg-muted"
                  >
                    {item.title}
                  </Link>
                ))}
              </nav>

              {session?.user ? (
                <form
                  action={logoutAction}
                  className="mt-auto border-t px-4 p-4"
                >
                  <Button
                    variant="destructive"
                    type="submit"
                    className="w-full justify-start"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </form>
              ) : null}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
