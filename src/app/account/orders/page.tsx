import Link from "next/link";

import { getCurrentUserOrders } from "@/server/queries/order-queries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function AccountOrdersPage() {
  const orders = await getCurrentUserOrders();

  if (!orders.length) {
    return (
      <div className="rounded-xl border bg-background p-10 text-center">
        <h1 className="text-2xl font-bold">No orders yet</h1>
        <p className="mt-2 text-muted-foreground">
          Your order history will appear here.
        </p>

        <Button className="mt-6">
          <Link href="/products">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-background p-6">
      <h1 className="text-2xl font-bold">My Orders</h1>

      <div className="mt-6 space-y-4">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/account/orders/${order.orderNumber}`}
            className="block rounded-xl border p-4 transition hover:bg-muted"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold">{order.orderNumber}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString()} ·{" "}
                  {order.items.length} item(s)
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Badge>{order.status}</Badge>
                <p className="font-bold">৳{Number(order.total)}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}