"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, LogOut, Menu, Package, User, X } from "lucide-react";
import { useState } from "react";

import { LogoutButton } from "@/components/shared/logout-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/server/actions/auth-actions";

const accountLinks = [
  {
    title: "Profile",
    href: "/account/profile",
    icon: User,
  },
  {
    title: "Orders",
    href: "/account/orders",
    icon: Package,
  },
  {
    title: "Wishlist",
    href: "/account/wishlist",
    icon: Heart,
  },
];

export function AccountSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={() => setOpen(true)}
        className="mb-4 md:hidden"
      >
        <Menu className="h-4 w-4" />
      </Button>

      {open ? (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen w-64 border-r bg-background p-5 transition-transform md:sticky md:top-20 md:z-auto md:h-fit md:translate-x-0 md:rounded-2xl md:border",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="mb-6 flex items-center justify-between md:hidden">
          <h2 className="text-lg font-bold">My Account</h2>

          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={() => setOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="space-y-1">
          {accountLinks.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition",
                  active
                    ? "bg-zinc-950 text-white"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.title}
              </Link>
            );
          })}
        </nav>

        <form action={logoutAction} className="mt-6">
          <Button variant="outline" className="w-full justify-start" type="submit">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </form>
      </aside>
    </>
  );
}