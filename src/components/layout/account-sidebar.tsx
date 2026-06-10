import Link from "next/link";
import { Heart, Package, User } from "lucide-react";

import { LogoutButton } from "@/components/shared/logout-button";

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
  return (
    <aside className="rounded-xl border bg-background p-4">
      <nav className="space-y-1">
        {accountLinks.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
            >
              <Icon className="h-4 w-4" />
              {item.title}
            </Link>
          );
        })}
      </nav>

      <div className="mt-6">
        <LogoutButton />
      </div>
    </aside>
  );
}