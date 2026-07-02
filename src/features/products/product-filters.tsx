"use client";

import type { Category } from "@prisma/client";
import {
  ArrowDownUp,
  ArrowLeft,
  Grid2X2,
  RotateCcw,
  Search,
  Sparkles,
  Trophy,
  X,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ProductFiltersProps = {
  categories: Category[];
};

export function ProductFilters({ categories }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());

    params.delete("page");

    if (!value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    router.push(`/products?${params.toString()}`);
  }

  function toggleParam(key: string) {
    const params = new URLSearchParams(searchParams.toString());

    params.delete("page");

    if (params.get(key) === "true") {
      params.delete(key);
    } else {
      params.set(key, "true");
    }

    router.push(`/products?${params.toString()}`);
  }

  function clearFilters() {
    router.push("/products");
  }

  const isFeatured = searchParams.get("featured") === "true";
  const isNewArrival = searchParams.get("newArrival") === "true";
  const isBestSeller = searchParams.get("bestSeller") === "true";

  return (
    <div className="mb-10">
      <div className="rounded-3xl border bg-background p-5 shadow-sm md:p-6">
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr_0.65fr]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search products..."
              defaultValue={searchParams.get("search") || ""}
              onChange={(event) => updateParam("search", event.target.value)}
              className="h-12 w-full rounded-xl border bg-background pl-11 pr-4 text-sm outline-none transition focus:border-black"
            />
          </div>

          <div className="relative">
            <Grid2X2 className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <select
              value={searchParams.get("category") || ""}
              onChange={(event) => updateParam("category", event.target.value)}
              className="h-12 w-full appearance-none rounded-xl border bg-background pl-11 pr-4 text-sm outline-none transition focus:border-black"
            >
              <option value="">All Categories</option>

              {categories.map((category) => (
                <option key={category.id} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <ArrowDownUp className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <select
              value={searchParams.get("sort") || ""}
              onChange={(event) => updateParam("sort", event.target.value)}
              className="h-12 w-full appearance-none rounded-xl border bg-background pl-11 pr-4 text-sm outline-none transition focus:border-black"
            >
              <option value="">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="my-5 h-px bg-border" />

        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm font-semibold">Filters</p>

          <Button
            variant="destructive"
            onClick={clearFilters}
            className="inline-flex items-center gap-2 text-sm rounded-full px-4 h-8"
          >
            <RotateCcw className="size-3.5" />
            Clear all
          </Button>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => toggleParam("featured")}
            className={cn(
              "h-8 rounded-full text-sm px-4",
              isFeatured && "border-amber-500 bg-amber-50 text-amber-700",
            )}
          >
            <Sparkles className="mr-1 h-4 w-4" />
            Featured
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => toggleParam("newArrival")}
            className={cn(
              "h-8 rounded-full text-sm px-4",
              isNewArrival && "border-black bg-black text-white",
            )}
          > 
          <div className="size-3 bg-black rounded-full mr-1"></div>
            New Arrival
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => toggleParam("bestSeller")}
            className={cn(
              "h-8 rounded-full text-sm px-4",
              isBestSeller && "border-black bg-black text-white",
            )}
          >
            <Trophy className="mr-1 h-4 w-4" />
            Best Seller
          </Button>
        </div>
      </div>
    </div>
  );
}
