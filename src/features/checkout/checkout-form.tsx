"use client";

import { useState, useTransition } from "react";

import { placeCashOnDeliveryOrderAction } from "@/server/actions/order-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RequiredLabel } from "@/components/shared/required-label";

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
          <RequiredLabel>Name</RequiredLabel>
          <Input
            name="customerName"
            defaultValue={defaultValues.customerName}
            required
          />
        </div>

        <div className="space-y-2">
          <RequiredLabel>Email</RequiredLabel>
          <Input
            name="customerEmail"
            type="email"
            defaultValue={defaultValues.customerEmail}
            required
          />
        </div>

        <div className="space-y-2">
          <RequiredLabel>Phone</RequiredLabel>
          <Input
            name="customerPhone"
            defaultValue={defaultValues.customerPhone || ""}
            required
          />
        </div>

        <div className="space-y-2">
          <RequiredLabel>City</RequiredLabel>
          <Input
            name="shippingCity"
            defaultValue={defaultValues.shippingCity || ""}
            required
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <RequiredLabel>Address</RequiredLabel>
          <textarea
            className="min-h-24 w-full rounded-xl border bg-background px-3 py-2 outline-none transition focus:border-zinc-950"
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

      <Button disabled={isPending} className="w-full h-10 rounded-full text-sm" size="lg" type="submit">
        {isPending ? "Placing Order..." : "Place Cash on Delivery Order"}
      </Button>
    </form>
  );
}