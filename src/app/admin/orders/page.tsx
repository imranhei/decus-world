import Link from "next/link";

import { Pagination } from "@/components/shared/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAdminOrders } from "@/server/queries/order-queries";

type PageProps = {
  searchParams: Promise<{
    page?: string;
  }>;
};

export default async function AdminOrdersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page || 1);

  const orderResult = await getAdminOrders({ page, limit: 10 });
  const orders = orderResult.orders;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Orders</h1>
        <p className="mt-1 text-muted-foreground">
          Manage customer Cash on Delivery orders.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border bg-background">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted">
            <tr>
              <th className="px-4 py-3 text-left">Order</th>
              <th className="px-4 py-3 text-left">Customer</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Payment</th>
              <th className="px-4 py-3 text-left">Total</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b last:border-0">
                <td className="px-4 py-3 font-medium">{order.orderNumber}</td>

                <td className="px-4 py-3">
                  <p>{order.customerName}</p>
                  <p className="text-xs text-muted-foreground">
                    {order.customerPhone}
                  </p>
                </td>

                <td className="px-4 py-3">
                  <Badge>{order.status}</Badge>
                </td>

                <td className="px-4 py-3">
                  <p>{order.paymentMethod}</p>
                  <p className="text-xs text-muted-foreground">
                    {order.paymentStatus}
                  </p>
                </td>

                <td className="px-4 py-3 font-semibold">
                  ৳{Number(order.total)}
                </td>

                <td className="px-4 py-3 text-right">
                  <Button size="sm" variant="outline">
                    <Link href={`/admin/orders/${order.orderNumber}`}>
                      View
                    </Link>
                  </Button>
                </td>
              </tr>
            ))}

            {!orders.length ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-muted-foreground"
                >
                  No orders found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>

        <Pagination
          page={orderResult.page}
          totalPages={orderResult.totalPages}
          basePath="/admin/orders"
          searchParams={params}
        />
      </div>
    </div>
  );
}
