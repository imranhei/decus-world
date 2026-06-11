"use client";

import { useState, useTransition } from "react";
import type { Coupon } from "@prisma/client";

import {
  createCouponAction,
  updateCouponAction,
} from "@/server/actions/admin-coupon-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type CouponFormProps = {
  coupon?: Coupon;
};

function formatDateInput(date?: Date | null) {
  if (!date) return "";
  return new Date(date).toISOString().slice(0, 10);
}

export function CouponForm({ coupon }: CouponFormProps) {
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError("");

    const values = {
      code: formData.get("code"),
      description: formData.get("description"),
      discountType: formData.get("discountType"),
      discountValue: formData.get("discountValue"),
      minimumOrderAmount: formData.get("minimumOrderAmount") || undefined,
      maximumDiscountAmount: formData.get("maximumDiscountAmount") || undefined,
      usageLimit: formData.get("usageLimit") || undefined,
      startsAt: formData.get("startsAt") || undefined,
      expiresAt: formData.get("expiresAt") || undefined,
      isActive: formData.get("isActive") === "on",
    };

    startTransition(async () => {
      const result = coupon
        ? await updateCouponAction(coupon.id, values)
        : await createCouponAction(values);

      if (result && !result.success) {
        setError(result.message);
      }
    });
  }

  return (
    <form
      action={handleSubmit}
      className="space-y-6 rounded-xl border bg-background p-6"
    >
      {error ? <p className="text-sm text-red-500">{error}</p> : null}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Coupon Code</Label>
          <Input
            name="code"
            defaultValue={coupon?.code || ""}
            placeholder="WELCOME10"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Discount Type</Label>
          <select
            name="discountType"
            defaultValue={coupon?.discountType || "PERCENTAGE"}
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          >
            <option value="PERCENTAGE">Percentage</option>
            <option value="FIXED">Fixed Amount</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label>Discount Value</Label>
          <Input
            name="discountValue"
            type="number"
            step="0.01"
            defaultValue={Number(coupon?.discountValue || 0)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Minimum Order Amount</Label>
          <Input
            name="minimumOrderAmount"
            type="number"
            step="0.01"
            defaultValue={Number(coupon?.minimumOrderAmount || 0) || ""}
            placeholder="1000"
          />
        </div>

        <div className="space-y-2">
          <Label>Maximum Discount Amount</Label>
          <Input
            name="maximumDiscountAmount"
            type="number"
            step="0.01"
            defaultValue={Number(coupon?.maximumDiscountAmount || 0) || ""}
            placeholder="500"
          />
        </div>

        <div className="space-y-2">
          <Label>Usage Limit</Label>
          <Input
            name="usageLimit"
            type="number"
            defaultValue={coupon?.usageLimit || ""}
            placeholder="100"
          />
        </div>

        <div className="space-y-2">
          <Label>Starts At</Label>
          <Input
            name="startsAt"
            type="date"
            defaultValue={formatDateInput(coupon?.startsAt)}
          />
        </div>

        <div className="space-y-2">
          <Label>Expires At</Label>
          <Input
            name="expiresAt"
            type="date"
            defaultValue={formatDateInput(coupon?.expiresAt)}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Description</Label>
          <textarea
            name="description"
            defaultValue={coupon?.description || ""}
            className="min-h-24 w-full rounded-md border bg-background px-3 py-2 text-sm"
            placeholder="Short note about this coupon"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          name="isActive"
          type="checkbox"
          defaultChecked={coupon?.isActive ?? true}
        />
        Active coupon
      </label>

      <Button disabled={isPending} type="submit">
        {isPending
          ? "Saving..."
          : coupon
            ? "Update Coupon"
            : "Create Coupon"}
      </Button>
    </form>
  );
}