import { notFound } from "next/navigation";

import { CouponForm } from "@/features/admin/coupons/coupon-form";
import { getAdminCouponById } from "@/server/queries/admin-coupon-queries";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditCouponPage({ params }: PageProps) {
  const { id } = await params;
  const coupon = await getAdminCouponById(id);

  if (!coupon) {
    notFound();
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit Coupon</h1>
        <p className="mt-1 text-muted-foreground">
          Update discount rules and coupon status.
        </p>
      </div>

      <CouponForm coupon={coupon} />
    </div>
  );
}