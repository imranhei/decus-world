import Link from "next/link";

import { getAdminCoupons } from "@/server/queries/admin-coupon-queries";
import { toggleCouponStatusAction } from "@/server/actions/admin-coupon-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function AdminCouponsPage() {
  const coupons = await getAdminCoupons();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Coupons</h1>
          <p className="mt-1 text-muted-foreground">
            Manage discount coupons and usage rules.
          </p>
        </div>

        <Button className="h-10 rounded-full px-6 text-sm">
          <Link href="/admin/coupons/new">Add Coupon</Link>
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border bg-background">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted">
            <tr>
              <th className="px-4 py-3 text-left">Code</th>
              <th className="px-4 py-3 text-left">Discount</th>
              <th className="px-4 py-3 text-left">Minimum Order</th>
              <th className="px-4 py-3 text-left">Usage</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {coupons.map((coupon) => (
              <tr key={coupon.id} className="border-b last:border-0">
                <td className="px-4 py-3">
                  <p className="font-semibold">{coupon.code}</p>
                  <p className="text-xs text-muted-foreground">
                    {coupon.description || "No description"}
                  </p>
                </td>

                <td className="px-4 py-3">
                  {coupon.discountType === "PERCENTAGE"
                    ? `${Number(coupon.discountValue)}%`
                    : `৳${Number(coupon.discountValue)}`}
                </td>

                <td className="px-4 py-3">
                  {coupon.minimumOrderAmount
                    ? `৳${Number(coupon.minimumOrderAmount)}`
                    : "None"}
                </td>

                <td className="px-4 py-3">
                  {coupon.usedCount}
                  {coupon.usageLimit ? ` / ${coupon.usageLimit}` : ""}
                </td>

                <td className="px-4 py-3">
                  <Badge variant={coupon.isActive ? "default" : "secondary"}>
                    {coupon.isActive ? "ACTIVE" : "INACTIVE"}
                  </Badge>
                </td>

                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="outline">
                      <Link href={`/admin/coupons/${coupon.id}/edit`}>
                        Edit
                      </Link>
                    </Button>

                    <form
                      action={async () => {
                        "use server";
                        await toggleCouponStatusAction(coupon.id);
                      }}
                    >
                      <Button size="sm" variant="secondary">
                        {coupon.isActive ? "Disable" : "Enable"}
                      </Button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}

            {!coupons.length ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-muted-foreground"
                >
                  No coupons found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}