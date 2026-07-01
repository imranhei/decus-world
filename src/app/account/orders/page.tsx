import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCurrentUserOrders } from "@/server/queries/order-queries";
import {
  Calendar,
  ChevronRight,
  CreditCard,
  MapPin,
  Package,
} from "lucide-react";

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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
        <p className="mt-1 text-muted-foreground">
          Track your orders and view order history.
        </p>
      </div>

      <div className="space-y-5">
        {orders.map((order) => (
          <div
            key={order.id}
            className="group block overflow-hidden rounded-2xl border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">
                    Order Number
                  </p>

                  <h3 className="mt-1 text-lg font-bold">
                    {order.orderNumber}
                  </h3>

                  <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Badge>{order.status}</Badge>

                  <Badge
                    variant={
                      order.paymentStatus === "PAID" ? "default" : "secondary"
                    }
                  >
                    {order.paymentStatus}
                  </Badge>
                </div>
              </div>

              {/* Summary */}
              <div className="mt-6 grid gap-5 md:grid-cols-3">
                <div className="rounded-xl bg-muted/40 p-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Package className="h-4 w-4" />
                    <span className="text-sm">Items</span>
                  </div>

                  <p className="mt-2 text-2xl font-bold">
                    {order.items.length}
                  </p>
                </div>

                <div className="rounded-xl bg-muted/40 p-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CreditCard className="h-4 w-4" />
                    <span className="text-sm">Payment</span>
                  </div>

                  <p className="mt-2 font-semibold">
                    {order.paymentMethod
                      .replaceAll("_", " ")
                      .toLowerCase()
                      .replace(/\b\w/g, (c) => c.toUpperCase())}
                  </p>
                </div>

                <div className="rounded-xl bg-muted/40 p-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">Delivery</span>
                  </div>

                  <p className="mt-2 font-semibold">{order.shippingCity}</p>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 flex flex-wrap items-center justify-between border-t pt-5">
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>

                  <p className="text-2xl font-bold text-primary">
                    ৳{Number(order.total).toLocaleString()}
                  </p>
                </div>

                <Link
                  href={`/account/orders/${order.orderNumber}`}
                  className="flex items-center gap-2 text-sm font-medium text-teal-500 transition-all group-hover:gap-3"
                >
                  View Details
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
