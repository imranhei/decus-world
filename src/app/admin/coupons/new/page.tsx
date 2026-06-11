import { CouponForm } from "@/features/admin/coupons/coupon-form";

export default function NewCouponPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create Coupon</h1>
        <p className="mt-1 text-muted-foreground">
          Add coupon discount type, limits, and validity date.
        </p>
      </div>

      <CouponForm />
    </div>
  );
}