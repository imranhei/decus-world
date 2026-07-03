import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { TableActionMenu } from "@/components/shared/table-action-menu";

type AdminOrdersTableProps = {
  orders: Array<{
    id: string;
    orderNumber: string;
    customerName: string;
    customerPhone: string;
    customerEmail?: string | null;
    status: string;
    paymentMethod: string;
    paymentStatus: string;
    total: unknown;
    createdAt: Date | string;
  }>;
};

export function AdminOrdersTable({ orders }: AdminOrdersTableProps) {
  if (!orders.length) {
    return (
      <div className="rounded-xl border bg-background p-10 text-center text-muted-foreground">
        No orders found.
      </div>
    );
  }

  return (
    <>
      {/* Desktop / Tablet Table */}
      <div className="hidden overflow-hidden rounded-xl border bg-background md:block">
        <div className="overflow-x-auto">
          <table className="min-w-225 w-full text-sm">
            <thead className="border-b bg-muted">
              <tr>
                <th className="px-4 py-3 text-left">Order</th>
                <th className="px-4 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Payment</th>
                <th className="px-4 py-3 text-left">Total</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b transition last:border-0 hover:bg-muted/40"
                >
                  <td className="px-4 py-3 font-medium">
                    <Link
                      href={`/admin/orders/${order.orderNumber}`}
                      className="hover:underline"
                    >
                      {order.orderNumber}
                    </Link>
                  </td>

                  <td className="px-4 py-3">
                    <p className="font-medium">{order.customerName}</p>
                    <p className="text-xs text-muted-foreground">
                      {order.customerPhone}
                    </p>
                    {order.customerEmail ? (
                      <p className="text-xs text-muted-foreground">
                        {order.customerEmail}
                      </p>
                    ) : null}
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
                    ৳{Number(order.total).toLocaleString("en-US")}
                  </td>

                  <td className="px-4 py-3">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-4 py-3 text-right">
                    <TableActionMenu
                      viewHref={`/admin/orders/${order.orderNumber}`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="space-y-3 md:hidden">
        {orders.map((order) => (
          <div
            key={order.id}
            className="rounded-2xl border bg-background p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <Link
                  href={`/admin/orders/${order.orderNumber}`}
                  className="font-semibold hover:underline"
                >
                  {order.orderNumber}
                </Link>

                <p className="mt-1 text-sm font-medium">
                  {order.customerName}
                </p>

                <p className="text-xs text-muted-foreground">
                  {order.customerPhone}
                </p>
              </div>

              <TableActionMenu viewHref={`/admin/orders/${order.orderNumber}`} />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-muted/60 p-3">
                <p className="text-xs text-muted-foreground">Status</p>
                <div className="mt-1">
                  <Badge>{order.status}</Badge>
                </div>
              </div>

              <div className="rounded-xl bg-muted/60 p-3">
                <p className="text-xs text-muted-foreground">Payment</p>
                <p className="mt-1 font-medium">{order.paymentMethod}</p>
                <p className="text-xs text-muted-foreground">
                  {order.paymentStatus}
                </p>
              </div>

              <div className="rounded-xl bg-muted/60 p-3">
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="mt-1 font-semibold">
                  ৳{Number(order.total).toLocaleString("en-US")}
                </p>
              </div>

              <div className="rounded-xl bg-muted/60 p-3">
                <p className="text-xs text-muted-foreground">Date</p>
                <p className="mt-1 font-medium">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}