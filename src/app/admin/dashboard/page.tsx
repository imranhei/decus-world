import Link from "next/link";
import {
  AlertTriangle,
  Boxes,
  Clock,
  Package,
  ShoppingCart,
  Users,
  Wallet,
} from "lucide-react";

import { getAdminDashboardStats } from "@/server/queries/admin-dashboard-queries";
import { StatCard } from "@/features/admin/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function AdminDashboardPage() {
  const stats = await getAdminDashboardStats();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Overview of sales, orders, products, and inventory.
        </p>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={`৳${stats.totalRevenue}`}
          description="Excluding cancelled and returned orders"
          icon={Wallet}
        />

        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          description={`${stats.pendingOrders} pending orders`}
          icon={ShoppingCart}
        />

        <StatCard
          title="Products"
          value={stats.totalProducts}
          description={`${stats.activeProducts} active products`}
          icon={Package}
        />

        <StatCard
          title="Customers"
          value={stats.totalCustomers}
          description="Registered customer accounts"
          icon={Users}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="rounded-xl border bg-background">
          <div className="flex items-center justify-between border-b p-5">
            <div>
              <h2 className="font-semibold">Recent Orders</h2>
              <p className="text-sm text-muted-foreground">
                Latest customer orders.
              </p>
            </div>

            <Button size="sm" variant="outline">
              <Link href="/admin/orders">View All</Link>
            </Button>
          </div>

          <div className="divide-y">
            {stats.recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/admin/orders/${order.orderNumber}`}
                className="flex items-center justify-between gap-4 p-5 transition hover:bg-muted"
              >
                <div>
                  <p className="font-medium">{order.orderNumber}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.customerName} · {order.items.length} item(s)
                  </p>
                </div>

                <div className="text-right">
                  <Badge>{order.status}</Badge>
                  <p className="mt-1 font-semibold">৳{Number(order.total)}</p>
                </div>
              </Link>
            ))}

            {!stats.recentOrders.length ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                No recent orders found.
              </div>
            ) : null}
          </div>
        </div>

        <div className="rounded-xl border bg-background">
          <div className="border-b p-5">
            <h2 className="font-semibold">Order Status</h2>
            <p className="text-sm text-muted-foreground">
              Current order distribution.
            </p>
          </div>

          <div className="space-y-3 p-5">
            {stats.orderStatusCounts.map((item) => (
              <div
                key={item.status}
                className="flex items-center justify-between rounded-lg bg-muted px-3 py-2 text-sm"
              >
                <span>{item.status}</span>
                <Badge variant="secondary">{item._count.status}</Badge>
              </div>
            ))}

            {!stats.orderStatusCounts.length ? (
              <p className="text-sm text-muted-foreground">
                No order data found.
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <section className="rounded-xl border bg-background">
        <div className="flex items-center justify-between border-b p-5">
          <div>
            <h2 className="font-semibold">Low Stock Alerts</h2>
            <p className="text-sm text-muted-foreground">
              Variants with stock quantity 10 or below.
            </p>
          </div>

          <AlertTriangle className="h-5 w-5 text-amber-500" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted">
              <tr>
                <th className="px-4 py-3 text-left">Product</th>
                <th className="px-4 py-3 text-left">Variant</th>
                <th className="px-4 py-3 text-left">SKU</th>
                <th className="px-4 py-3 text-left">Stock</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {stats.lowStockVariants.map((variant) => (
                <tr key={variant.id} className="border-b last:border-0">
                  <td className="px-4 py-3 font-medium">
                    {variant.product.name}
                  </td>
                  <td className="px-4 py-3">
                    {variant.size} / {variant.color}
                  </td>
                  <td className="px-4 py-3">{variant.sku || "N/A"}</td>
                  <td className="px-4 py-3">
                    <Badge variant="destructive">
                      {variant.inventory?.quantity || 0}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button size="sm" variant="outline">
                      <Link href={`/admin/products/${variant.productId}/edit`}>
                        Update
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))}

              {!stats.lowStockVariants.length ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-10 text-center text-muted-foreground"
                  >
                    No low stock products.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}