"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { registerAction } from "@/server/actions/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError("");

    const values = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    };

    startTransition(async () => {
      const result = await registerAction(values);

      if (!result?.success) {
        setError(result?.message || "Something went wrong");
        return;
      }

      router.push("/login");
    });
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create account</CardTitle>
      </CardHeader>

      <CardContent>
        <form action={handleSubmit} className="space-y-4">
          {error ? <p className="text-sm text-red-500">{error}</p> : null}

          <div className="space-y-2">
            <Label>Name</Label>
            <Input name="name" placeholder="Your name" required />
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input name="email" type="email" placeholder="you@example.com" required />
          </div>

          <div className="space-y-2">
            <Label>Password</Label>
            <Input name="password" type="password" placeholder="Minimum 8 characters" required />
          </div>

          <Button className="w-full" disabled={isPending} type="submit">
            {isPending ? "Creating account..." : "Create account"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary">
              Login
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}