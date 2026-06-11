import Link from "next/link";

import { getAdminCustomers } from "@/server/queries/admin-customer-queries";
import { Pagination } from "@/components/shared/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type PageProps = {
  searchParams: Promise<{
    page?: string;
  }>;
};

export default async function AdminCustomersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page || 1);

  const customerResult = await getAdminCustomers({
    page,
    limit: 10,
  });

  const customers = customerResult.customers;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Customers</h1>
        <p className="mt-1 text-muted-foreground">
          Manage customers, staff, admins, and customer order history.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border bg-background">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted">
            <tr>
              <th className="px-4 py-3 text-left">User</th>
              <th className="px-4 py-3 text-left">Phone</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">Orders</th>
              <th className="px-4 py-3 text-left">Joined</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="border-b last:border-0">
                <td className="px-4 py-3">
                  <p className="font-medium">{customer.name || "No name"}</p>
                  <p className="text-xs text-muted-foreground">
                    {customer.email}
                  </p>
                </td>

                <td className="px-4 py-3">{customer.phone || "N/A"}</td>

                <td className="px-4 py-3">
                  <Badge>{customer.role}</Badge>
                </td>

                <td className="px-4 py-3">{customer._count.orders}</td>

                <td className="px-4 py-3">
                  {new Date(customer.createdAt).toLocaleDateString()}
                </td>

                <td className="px-4 py-3 text-right">
                  <Button size="sm" variant="outline">
                    <Link href={`/admin/customers/${customer.id}`}>View</Link>
                  </Button>
                </td>
              </tr>
            ))}

            {!customers.length ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-muted-foreground"
                >
                  No customers found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <Pagination
        page={customerResult.page}
        totalPages={customerResult.totalPages}
        basePath="/admin/customers"
        searchParams={params}
      />
    </div>
  );
}