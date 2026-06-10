"use client";

import { useState, useTransition } from "react";
import type { OrderStatus } from "@prisma/client";

import { updateOrderStatusAction } from "@/server/actions/admin-order-actions";
import { Button } from "@/components/ui/button";

const statuses: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "RETURNED",
];

export function OrderStatusForm({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: OrderStatus;
}) {
  const [status, setStatus] = useState<OrderStatus>(currentStatus);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleUpdate() {
    setMessage("");

    startTransition(async () => {
      const result = await updateOrderStatusAction({
        orderId,
        status,
      });

      setMessage(result.message);
    });
  }

  return (
    <div className="rounded-xl border bg-background p-6">
      <h2 className="font-semibold">Update Status</h2>

      <div className="mt-4 flex gap-3">
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value as OrderStatus)}
          className="h-10 rounded-md border bg-background px-3 text-sm"
        >
          {statuses.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <Button disabled={isPending} onClick={handleUpdate}>
          {isPending ? "Updating..." : "Update"}
        </Button>
      </div>

      {message ? (
        <p className="mt-3 text-sm text-muted-foreground">{message}</p>
      ) : null}
    </div>
  );
}