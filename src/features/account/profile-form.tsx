"use client";

import type { User } from "@prisma/client";
import { MapPin, Phone, Save, UserRound } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { RequiredLabel } from "@/components/shared/required-label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfileAction } from "@/server/actions/profile-actions";

type ProfileFormProps = {
  user: Pick<
    User,
    "name" | "email" | "phone" | "address" | "city" | "postalCode"
  >;
};

export function ProfileForm({ user }: ProfileFormProps) {
  const [isPending, startTransition] = useTransition();

  const [form, setForm] = useState({
    name: user.name || "",
    phone: user.phone || "",
    address: user.address || "",
    city: user.city || "",
    postalCode: user.postalCode || "",
  });

  function updateField(field: keyof typeof form, value: string) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(async () => {
      const result = await updateProfileAction(form);

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="overflow-hidden rounded-3xl border bg-background shadow-sm"
    >
      <div className="border-b bg-muted/40 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-zinc-950 text-white">
            <UserRound className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold">Profile Information</h2>
            <p className="text-sm text-muted-foreground">
              Update your contact and shipping details.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 p-6 md:grid-cols-2">
        <div className="space-y-2">
          <RequiredLabel>Name</RequiredLabel>
          <Input
            name="name"
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            placeholder="Your full name"
            className="h-10 rounded-xl"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Email</Label>
          <Input
            value={user.email || ""}
            disabled
            className="h-10 rounded-xl bg-muted/60"
          />
        </div>

        <div className="space-y-2">
          <Label>Phone</Label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              name="phone"
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              placeholder="+8801XXXXXXXXX"
              className="h-10 rounded-xl pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>City</Label>
          <Input
            name="city"
            value={form.city}
            onChange={(e) => updateField("city", e.target.value)}
            placeholder="Dhaka"
            className="h-10 rounded-xl"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Address</Label>
          <div className="relative">
            <MapPin className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
            <textarea
              name="address"
              value={form.address}
              onChange={(e) => updateField("address", e.target.value)}
              placeholder="House, road, area, city"
              className="min-h-24 w-full rounded-xl border bg-background px-10 py-3 text-sm outline-none transition focus:border-zinc-950"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Postal Code</Label>
          <Input
            name="postalCode"
            value={form.postalCode}
            onChange={(e) => updateField("postalCode", e.target.value)}
            placeholder="1216"
            className="h-10 rounded-xl"
          />
        </div>
      </div>

      <div className="flex items-center justify-between border-t bg-muted/30 px-6 py-5">
        <Button
          variant="link"
          size="sm"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          <Link href="/reset-password">Reset Password</Link>
        </Button>
        <Button
          disabled={isPending}
          type="submit"
          className="h-10 rounded-xl bg-zinc-950 px-6 text-white hover:bg-zinc-800"
        >
          <Save className="mr-2 h-4 w-4" />
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
