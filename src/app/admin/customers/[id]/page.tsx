import Link from "next/link";
import { notFound } from "next/navigation";

import { getAdminCustomerById } from "@/server/queries/admin-customer-queries";
import { UserRoleForm } from "@/features/admin/customers/user-role-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminCustomerDetailsPage({ params }: PageProps) {
  const { id } = await params;

  const customer = await getAdminCustomerById(id);

  if (!customer) {
    notFound();
  }

  const totalSpent = customer.orders.reduce((total, order) => {
    if (order.status === "CANCELLED" || order.status === "RETURNED") {
      return total;
    }

    return total + Number(order.total);
  }, 0);

  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-background p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">
              {customer.name || "Unnamed User"}
            </h1>
            <p className="mt-1 text-muted-foreground">{customer.email}</p>
          </div>

          <Badge>{customer.role}</Badge>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm text-muted-foreground">Total Orders</p>
            <p className="mt-1 text-2xl font-bold">{customer.orders.length}</p>
          </div>

          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm text-muted-foreground">Total Spent</p>
            <p className="mt-1 text-2xl font-bold">৳{totalSpent}</p>
          </div>

          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm text-muted-foreground">Joined</p>
            <p className="mt-1 text-2xl font-bold">
              {new Date(customer.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-background p-6">
        <h2 className="font-semibold">Contact Information</h2>

        <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
          <p>
            <span className="text-muted-foreground">Phone:</span>{" "}
            {customer.phone || "N/A"}
          </p>
          <p>
            <span className="text-muted-foreground">City:</span>{" "}
            {customer.city || "N/A"}
          </p>
          <p className="md:col-span-2">
            <span className="text-muted-foreground">Address:</span>{" "}
            {customer.address || "N/A"}
          </p>
          <p>
            <span className="text-muted-foreground">Postal Code:</span>{" "}
            {customer.postalCode || "N/A"}
          </p>
        </div>
      </div>

      <div className="rounded-xl border bg-background p-6">
        <h2 className="font-semibold">Role Management</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Only admins can change user roles.
        </p>

        <div className="mt-4">
          <UserRoleForm userId={customer.id} currentRole={customer.role} />
        </div>
      </div>

      <div className="rounded-xl border bg-background">
        <div className="border-b p-6">
          <h2 className="font-semibold">Order History</h2>
        </div>

        <div className="divide-y">
          {customer.orders.map((order) => (
            <div
              key={order.id}
              className="flex flex-wrap items-center justify-between gap-4 p-5"
            >
              <div>
                <p className="font-medium">{order.orderNumber}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString()} ·{" "}
                  {order.items.length} item(s)
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Badge>{order.status}</Badge>
                <p className="font-semibold">৳{Number(order.total)}</p>

                <Button size="sm" variant="outline" className="h-10 rounded-full px-6 text-sm text-teal-500">
                  <Link href={`/admin/orders/${order.orderNumber}`}>View</Link>
                </Button>
              </div>
            </div>
          ))}

          {!customer.orders.length ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No orders found for this user.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}