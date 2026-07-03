import Link from "next/link";

import { Pagination } from "@/components/shared/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AdminOrderFilters } from "@/features/admin/orders/admin-order-filters";
import { AdminOrdersTable } from "@/features/admin/orders/admin-orders-table";
import { getAdminOrders } from "@/server/queries/order-queries";
import { MoreHorizontal } from "lucide-react";

type PageProps = {
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: string;
    paymentMethod?: string;
    paymentStatus?: string;
    sort?: string;
  }>;
};

export default async function AdminOrdersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page || 1);

  const orderResult = await getAdminOrders({
    page,
    limit: 20,
    search: params.search,
    status: params.status,
    paymentMethod: params.paymentMethod,
    paymentStatus: params.paymentStatus,
    sort: params.sort,
  });
  const orders = orderResult.orders;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Orders</h1>
        <p className="mt-1 text-muted-foreground">
          Manage customer Cash on Delivery orders.
        </p>
      </div>

      <AdminOrderFilters />

      <AdminOrdersTable orders={orders} />

        <Pagination
          page={orderResult.page}
          totalPages={orderResult.totalPages}
          basePath="/admin/orders"
          searchParams={params}
        />
      </div>
  );
}
