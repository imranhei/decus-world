"use client";

import { useState, useTransition } from "react";
import type { Role } from "@prisma/client";

import { updateUserRoleAction } from "@/server/actions/admin-customer-actions";
import { Button } from "@/components/ui/button";

const roles: Role[] = ["CUSTOMER", "STAFF", "ADMIN"];

export function UserRoleForm({
  userId,
  currentRole,
}: {
  userId: string;
  currentRole: Role;
}) {
  const [role, setRole] = useState<Role>(currentRole);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleUpdate() {
    setMessage("");

    startTransition(async () => {
      const result = await updateUserRoleAction({
        userId,
        role,
      });

      setMessage(result.message);
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={role}
        onChange={(event) => setRole(event.target.value as Role)}
        className="h-9 rounded-md border bg-background px-3 text-sm"
      >
        {roles.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>

      <Button size="sm" disabled={isPending} onClick={handleUpdate} className="h-10 rounded-full px-6 text-sm">
        {isPending ? "Saving..." : "Update Role"}
      </Button>

      {message ? (
        <p className="w-full text-xs text-muted-foreground">{message}</p>
      ) : null}
    </div>
  );
}