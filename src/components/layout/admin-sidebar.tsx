"use client";

import {
  BarChart3,
  Boxes,
  Image,
  LayoutDashboard,
  Menu,
  Package,
  Percent,
  ShoppingCart,
  Star,
  User,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import dWLogo from "@/assets/dw_bold-03.png";
import NextImage from "next/image";
import { usePathname } from "next/navigation";

import { LogoutButton } from "@/components/shared/logout-button";
import { useState } from "react";

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
    title: "Reviews",
    href: "/admin/reviews",
    icon: Star,
  },
  {
    title: "Reports",
    href: "/admin/reports",
    icon: BarChart3,
  },
  {
  title: "My Profile",
  href: "/account/profile",
  icon: User,
},
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-50 rounded-md border bg-background p-2 lg:hidden"
      >
        <Menu className="size-4" />
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    <aside
        className={`
          fixed left-0 top-0 z-50 h-screen w-60 bg-zinc-950 text-white
          transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-6">
          <Link href="/admin/dashboard" className="text-xl font-semibold flex items-center gap-2">
            <NextImage src={dWLogo} alt="Decus World" height={40} width={40} className="invert" />Decus World
          </Link>

          <button
            onClick={() => setOpen(false)}
            className="lg:hidden"
          >
            <X className="size-4" />
          </button>
        </div>

      <nav className="space-y-1 p-3">
        {adminLinks.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-full px-3 py-2 text-sm font-medium ${
                pathname === item.href
                  ? "border-l-2 border-blue-500 bg-white/10 text-white"
                  : "border-l-2 border-transparent text-zinc-300 hover:bg-white/10 hover:text-white"
              }`}
              onClick={() => setOpen(false)}
            >
              <Icon className="h-4 w-4" />
              {item.title}
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-6 left-3 right-3">
        <LogoutButton className="text-black" />
      </div>
    </aside>
    </>
  );
}
