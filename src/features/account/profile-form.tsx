"use client";

import { useState, useTransition } from "react";
import type { User } from "@prisma/client";

import { updateProfileAction } from "@/server/actions/profile-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RequiredLabel } from "@/components/shared/required-label";

type ProfileFormProps = {
  user: Pick<User, "name" | "email" | "phone" | "address" | "city" | "postalCode">;
};

export function ProfileForm({ user }: ProfileFormProps) {
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setMessage("");

    const values = {
      name: formData.get("name"),
      phone: formData.get("phone"),
      address: formData.get("address"),
      city: formData.get("city"),
      postalCode: formData.get("postalCode"),
    };

    startTransition(async () => {
      const result = await updateProfileAction(values);
      setMessage(result.message);
    });
  }

  return (
    <form
      action={handleSubmit}
      className="space-y-6 rounded-xl border bg-background p-6"
    >
      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <RequiredLabel>Name</RequiredLabel>
          <Input name="name" defaultValue={user.name || ""} required />
        </div>

        <div className="space-y-2">
          <Label>Email</Label>
          <Input value={user.email || ""} disabled />
        </div>

        <div className="space-y-2">
          <Label>Phone</Label>
          <Input name="phone" defaultValue={user.phone || ""} />
        </div>

        <div className="space-y-2">
          <Label>City</Label>
          <Input name="city" defaultValue={user.city || ""} />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Address</Label>
          <Input name="address" defaultValue={user.address || ""} />
        </div>

        <div className="space-y-2">
          <Label>Postal Code</Label>
          <Input name="postalCode" defaultValue={user.postalCode || ""} />
        </div>
      </div>

      <Button disabled={isPending} type="submit">
        {isPending ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}