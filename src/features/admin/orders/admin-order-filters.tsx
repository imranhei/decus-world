"use client";

import { RotateCcw, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";

export function AdminOrderFilters() {
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

    router.push(`/admin/orders?${params.toString()}`);
  }

  function clearFilters() {
    router.push("/admin/orders");
  }

  return (
    <div className="mb-6 rounded-2xl border bg-background p-4 shadow-sm">
      <div className="space-y-3 rounded-2xl bg-card">
        {/* Search + Reset */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <input
              defaultValue={searchParams.get("search") || ""}
              onChange={(event) => updateParam("search", event.target.value)}
              placeholder="Search order, customer, email, phone, product..."
              className="h-10 w-full rounded-xl border bg-background pl-10 pr-3 text-sm outline-none transition-colors focus:border-primary"
            />
          </div>

          <Button
            type="button"
            variant="destructive"
            onClick={clearFilters}
            className="h-10 rounded-xl w-auto sm:w-40"
          >
            <RotateCcw className="mr-1 h-4 w-4" />
            Reset
          </Button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
          {/* Status */}
          <select
            value={searchParams.get("status") || ""}
            onChange={(event) => updateParam("status", event.target.value)}
            className="h-10 rounded-xl border bg-background px-3 text-sm outline-none transition-colors focus:border-primary"
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PROCESSING">Processing</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="RETURNED">Returned</option>
          </select>

          {/* Payment Method */}
          <select
            value={searchParams.get("paymentMethod") || ""}
            onChange={(event) =>
              updateParam("paymentMethod", event.target.value)
            }
            className="h-10 rounded-xl border bg-background px-3 text-sm outline-none transition-colors focus:border-primary"
          >
            <option value="">All Payment</option>
            <option value="CASH_ON_DELIVERY">Cash on Delivery</option>
          </select>

          {/* Payment Status */}
          <select
            value={searchParams.get("paymentStatus") || ""}
            onChange={(event) =>
              updateParam("paymentStatus", event.target.value)
            }
            className="h-10 rounded-xl border bg-background px-3 text-sm outline-none transition-colors focus:border-primary"
          >
            <option value="">Payment Status</option>
            <option value="UNPAID">Unpaid</option>
            <option value="PAID">Paid</option>
            <option value="FAILED">Failed</option>
            <option value="REFUNDED">Refunded</option>
          </select>

          {/* Sort */}
          <select
            value={searchParams.get("sort") || ""}
            onChange={(event) => updateParam("sort", event.target.value)}
            className="h-10 rounded-xl border bg-background px-3 text-sm outline-none transition-colors focus:border-primary"
          >
            <option value="">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="highest">Highest Total</option>
            <option value="lowest">Lowest Total</option>
          </select>
        </div>
      </div>
    </div>
  );
}
