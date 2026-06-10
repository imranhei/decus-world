"use client";

import { useState, useTransition } from "react";

import { placeCashOnDeliveryOrderAction } from "@/server/actions/order-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type CheckoutFormProps = {
  defaultValues: {
    customerName: string;
    customerEmail: string;
    customerPhone?: string | null;
    shippingAddress?: string | null;
    shippingCity?: string | null;
    shippingPostalCode?: string | null;
  };
};

export function CheckoutForm({ defaultValues }: CheckoutFormProps) {
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError("");

    const values = {
      customerName: formData.get("customerName"),
      customerEmail: formData.get("customerEmail"),
      customerPhone: formData.get("customerPhone"),
      shippingAddress: formData.get("shippingAddress"),
      shippingCity: formData.get("shippingCity"),
      shippingPostalCode: formData.get("shippingPostalCode"),
      notes: formData.get("notes"),
    };

    startTransition(async () => {
      const result = await placeCashOnDeliveryOrderAction(values);

      if (result && !result.success) {
        setError(result.message);
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-5 rounded-xl border p-6">
      <h2 className="text-xl font-bold">Shipping Information</h2>

      {error ? <p className="text-sm text-red-500">{error}</p> : null}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Name</Label>
          <Input
            name="customerName"
            defaultValue={defaultValues.customerName}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Email</Label>
          <Input
            name="customerEmail"
            type="email"
            defaultValue={defaultValues.customerEmail}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Phone</Label>
          <Input
            name="customerPhone"
            defaultValue={defaultValues.customerPhone || ""}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>City</Label>
          <Input
            name="shippingCity"
            defaultValue={defaultValues.shippingCity || ""}
            required
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Address</Label>
          <Input
            name="shippingAddress"
            defaultValue={defaultValues.shippingAddress || ""}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Postal Code</Label>
          <Input
            name="shippingPostalCode"
            defaultValue={defaultValues.shippingPostalCode || ""}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Order Notes</Label>
          <Input name="notes" placeholder="Optional" />
        </div>
      </div>

      <Button disabled={isPending} className="w-full" size="lg">
        {isPending ? "Placing Order..." : "Place Cash on Delivery Order"}
      </Button>
    </form>
  );
}