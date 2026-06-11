"use client";

import { useState, useTransition } from "react";

import {
  applyCouponAction,
  removeCouponAction,
} from "@/server/actions/coupon-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type CouponFormProps = {
  subtotal: number;
  appliedCode?: string;
  discount?: number;
};

export function CouponForm({
  subtotal,
  appliedCode,
  discount = 0,
}: CouponFormProps) {
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleApply(formData: FormData) {
    setMessage("");

    const code = String(formData.get("code") || "");

    startTransition(async () => {
      const result = await applyCouponAction({
        code,
        subtotal,
      });

      setMessage(result.message);
    });
  }

  function handleRemove() {
    setMessage("");

    startTransition(async () => {
      await removeCouponAction();
      setMessage("Coupon removed");
    });
  }

  return (
    <div className="space-y-3 border-t pt-4">
      <p className="font-medium">Coupon</p>

      {appliedCode ? (
        <div className="rounded-lg bg-muted p-3 text-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-semibold">{appliedCode}</p>
              <p className="text-muted-foreground">
                Discount: ৳{discount}
              </p>
            </div>

            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={isPending}
              onClick={handleRemove}
            >
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <form action={handleApply} className="flex gap-2">
          <Input name="code" placeholder="WELCOME10" />
          <Button disabled={isPending}>
            {isPending ? "Applying..." : "Apply"}
          </Button>
        </form>
      )}

      {message ? (
        <p className="text-sm text-muted-foreground">{message}</p>
      ) : null}
    </div>
  );
}