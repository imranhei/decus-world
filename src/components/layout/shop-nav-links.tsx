"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

const navLinks = [
  { title: "Home", href: "/" },
  { title: "Products", href: "/products" },
  { title: "Men", href: "/products?category=men" },
  { title: "Women", href: "/products?category=women" },
  { title: "Our Story", href: "/our-story" },
];

export function ShopNavLinks({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const category = searchParams.get("category");

  return (
    <>
      {navLinks.map((item) => {
        let active = false;

        switch (item.title) {
          case "Home":
            active = pathname === "/";
            break;

          case "Products":
            active = pathname === "/products" && !category;
            break;

          case "Men":
            active = pathname === "/products" && category === "men";
            break;

          case "Women":
            active = pathname === "/products" && category === "women";
            break;

          default:
            active = pathname === item.href;
        }
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              mobile
                ? "block rounded-xl px-3 py-2 text-sm font-medium"
                : "relative text-sm font-medium transition-colors",
              active
                ? mobile
                  ? "bg-primary/10 text-primary"
                  : "text-primary"
                : mobile
                  ? "hover:bg-muted"
                  : "text-muted-foreground hover:text-foreground",
            )}
          >
            {item.title}

            {!mobile && (
              <span
                className={cn(
                  "absolute -bottom-1 left-0 h-0.5 rounded-full bg-primary transition-all duration-300",
                  active ? "w-full" : "w-0",
                )}
              />
            )}
          </Link>
        );
      })}
    </>
  );
}
