import { notFound } from "next/navigation";

import { getAdminOrderByNumber } from "@/server/queries/order-queries";
import { OrderStatusForm } from "@/features/admin/orders/order-status-form";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

type PageProps = {
  params: Promise<{
    orderNumber: string;
  }>;
};

export default async function AdminOrderDetailsPage({ params }: PageProps) {
  const { orderNumber } = await params;
  const order = await getAdminOrderByNumber(orderNumber);

  if (!order) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-background p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Order {order.orderNumber}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Placed on {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>

          <Badge>{order.status}</Badge>
        </div>
      </div>

      <OrderStatusForm orderId={order.id} currentStatus={order.status} />

      <div className="rounded-xl border bg-background p-6">
        <h2 className="font-semibold">Customer</h2>

        <div className="mt-4 space-y-1 text-sm text-muted-foreground">
          <p>{order.customerName}</p>
          <p>{order.customerPhone}</p>
          <p>{order.customerEmail}</p>
          <p>{order.shippingAddress}</p>
          <p>
            {order.shippingCity} {order.shippingPostalCode}
          </p>
          {order.notes ? <p>Note: {order.notes}</p> : null}
        </div>
      </div>

      <div className="rounded-xl border bg-background p-6">
        <h2 className="font-semibold">Items</h2>

        <div className="mt-4 space-y-4">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between gap-4 border-b pb-4 last:border-0 last:pb-0"
            >
              <div>
                <Link
                  href={`/products/${item.product.slug}`}
                  className="font-medium text-teal-500 hover:underline"
                >
                  {item.productName}
                </Link>
                <p className="text-sm text-muted-foreground">
                  SKU: {item.sku || "N/A"} · {item.size} / {item.color} · Qty{" "}
                  {item.quantity}
                </p>
              </div>

              <p className="font-semibold">৳{Number(item.totalPrice)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border bg-background p-6">
        <h2 className="font-semibold">Payment Summary</h2>

        <div className="mt-4 max-w-md space-y-3 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>৳{Number(order.subtotal)}</span>
          </div>

          <div className="flex justify-between">
            <span>Shipping</span>
            <span>৳{Number(order.shippingTotal)}</span>
          </div>

          <div className="flex justify-between">
            <span>Discount</span>
            <span>৳{Number(order.discountTotal)}</span>
          </div>

          <div className="flex justify-between border-t pt-3 text-lg font-bold">
            <span>Total</span>
            <span>৳{Number(order.total)}</span>
          </div>

          <p className="text-muted-foreground">
            {order.paymentMethod} · {order.paymentStatus}
          </p>
        </div>
      </div>
    </div>
  );
}