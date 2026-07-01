"use client";

import { RotateCcw, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";

export function AdminCustomerFilters() {
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

    router.push(`/admin/customers?${params.toString()}`);
  }

  function clearFilters() {
    router.push("/admin/customers");
  }

  return (
    <div className="mb-6 rounded-2xl border bg-background p-4 shadow-sm">
      <div className="space-y-3">
        {/* Search + Reset */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <input
              defaultValue={searchParams.get("search") || ""}
              onChange={(event) => updateParam("search", event.target.value)}
              placeholder="Search name, email, phone, city, address..."
              className="h-10 w-full rounded-xl border bg-background pl-10 pr-3 text-sm outline-none transition-colors focus:border-primary"
            />
          </div>

          <Button
            type="button"
            variant="destructive"
            onClick={clearFilters}
            className="h-10 rounded-xl sm:w-40"
          >
            <RotateCcw className="mr-1 h-4 w-4" />
            Reset
          </Button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 gap-2">
          {/* Role */}
          <select
            value={searchParams.get("role") || ""}
            onChange={(event) => updateParam("role", event.target.value)}
            className="h-10 rounded-xl border bg-background px-3 text-sm outline-none transition-colors focus:border-primary"
          >
            <option value="">All Roles</option>
            <option value="CUSTOMER">Customer</option>
            <option value="STAFF">Staff</option>
            <option value="ADMIN">Admin</option>
          </select>

          {/* Sort */}
          <select
            value={searchParams.get("sort") || ""}
            onChange={(event) => updateParam("sort", event.target.value)}
            className="h-10 rounded-xl border bg-background px-3 text-sm outline-none transition-colors focus:border-primary"
          >
            <option value="">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
          </select>
        </div>
      </div>
    </div>
  );
}
