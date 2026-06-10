"use client";

import { useState, useTransition } from "react";
import Link from "next/link";

import { loginAction } from "@/server/actions/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError("");

    const values = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    startTransition(async () => {
      const result = await loginAction(values);

      if (!result?.success) {
        setError(result?.message || "Something went wrong");
      }
    });
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>

      <CardContent>
        <form action={handleSubmit} className="space-y-4">
          {error ? <p className="text-sm text-red-500">{error}</p> : null}

          <div className="space-y-2">
            <Label>Email</Label>
            <Input name="email" type="email" placeholder="admin@example.com" required />
          </div>

          <div className="space-y-2">
            <Label>Password</Label>
            <Input name="password" type="password" placeholder="********" required />
          </div>

          <Button className="w-full" disabled={isPending} type="submit">
            {isPending ? "Logging in..." : "Login"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            No account?{" "}
            <Link href="/register" className="font-medium text-primary">
              Register
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}