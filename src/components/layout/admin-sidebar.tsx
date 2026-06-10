import Link from "next/link";
import {
  BarChart3,
  Boxes,
  Image,
  LayoutDashboard,
  Package,
  Percent,
  ShoppingCart,
  Users,
} from "lucide-react";

import { LogoutButton } from "@/components/shared/logout-button";

const adminLinks = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "Categories",
    href: "/admin/categories",
    icon: Boxes,
  },
  {
    title: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    title: "Customers",
    href: "/admin/customers",
    icon: Users,
  },
  {
    title: "Coupons",
    href: "/admin/coupons",
    icon: Percent,
  },
  {
    title: "Banners",
    href: "/admin/banners",
    icon: Image,
  },
  {
    title: "Reports",
    href: "/admin/reports",
    icon: BarChart3,
  },
];

export function AdminSidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-72 border-r bg-zinc-950 text-white lg:block">
      <div className="flex h-16 items-center border-b border-white/10 px-6">
        <Link href="/admin/dashboard" className="text-xl font-bold">
          Decus Admin
        </Link>
      </div>

      <nav className="space-y-1 p-4">
        {adminLinks.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-300 hover:bg-white/10 hover:text-white"
            >
              <Icon className="h-4 w-4" />
              {item.title}
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-6 left-4 right-4">
        <LogoutButton />
      </div>
    </aside>
  );
}