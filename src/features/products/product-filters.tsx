"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { Category } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

  return (
    <div className="mb-8 rounded-xl border bg-background p-4">
      <div className="grid gap-4 md:grid-cols-[1fr_220px_220px]">
        <Input
          placeholder="Search products..."
          defaultValue={searchParams.get("search") || ""}
          onChange={(event) => updateParam("search", event.target.value)}
        />

        <select
          value={searchParams.get("category") || ""}
          onChange={(event) => updateParam("category", event.target.value)}
          className="h-10 rounded-md border bg-background px-3 text-sm"
        >
          <option value="">All Categories</option>

          {categories.map((category) => (
            <option key={category.id} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>

        <select
          value={searchParams.get("sort") || ""}
          onChange={(event) => updateParam("sort", event.target.value)}
          className="h-10 rounded-md border bg-background px-3 text-sm"
        >
          <option value="">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          type="button"
          variant={searchParams.get("featured") === "true" ? "default" : "outline"}
          onClick={() => toggleParam("featured")}
        >
          Featured
        </Button>

        <Button
          type="button"
          variant={searchParams.get("newArrival") === "true" ? "default" : "outline"}
          onClick={() => toggleParam("newArrival")}
        >
          New Arrival
        </Button>

        <Button
          type="button"
          variant={searchParams.get("bestSeller") === "true" ? "default" : "outline"}
          onClick={() => toggleParam("bestSeller")}
        >
          Best Seller
        </Button>

        <Button type="button" variant="ghost" onClick={clearFilters}>
          Clear
        </Button>
      </div>
    </div>
  );
}