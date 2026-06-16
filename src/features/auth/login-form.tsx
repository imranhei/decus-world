"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";

import { loginAction } from "@/server/actions/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(async () => {
      const result = await loginAction({ email, password });

      if (!result?.success) {
        toast.error(result?.message || "Invalid email or password");
      }
    });
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Password</Label>
            <Input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
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