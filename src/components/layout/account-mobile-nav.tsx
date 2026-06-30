"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Package, User } from "lucide-react";
import { cn } from "@/lib/utils";

const accountLinks = [
  { title: "Profile", href: "/account/profile", icon: User },
  { title: "Orders", href: "/account/orders", icon: Package },
  { title: "Wishlist", href: "/account/wishlist", icon: Heart },
];

export function AccountMobileNav() {
  const pathname = usePathname();

  return (
    <div className="mb-6 rounded-2xl border bg-background p-3 md:hidden">
      <div className="mb-3 px-1">
        <h2 className="font-semibold">My Account</h2>
        <p className="text-xs text-muted-foreground">
          Profile, orders and wishlist
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {accountLinks.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center rounded-xl px-2 py-3 text-xs font-medium transition",
                active
                  ? "bg-zinc-950 text-white"
                  : "bg-muted text-muted-foreground"
              )}
            >
              <Icon className="mb-1 h-4 w-4" />
              {item.title}
            </Link>
          );
        })}
      </div>
    </div>
  );
}