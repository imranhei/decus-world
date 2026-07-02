"use client";

import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { RequiredLabel } from "@/components/shared/required-label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginAction } from "@/server/actions/auth-actions";

type LoginFormProps = {
  callbackUrl?: string;
};

export function LoginForm({ callbackUrl }: LoginFormProps) {
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(async () => {
      const result = await loginAction({ email, password, callbackUrl });

      if (!result?.success) {
        toast.error(result?.message || "Invalid email or password");
      }
    });
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.35em] text-muted-foreground">
          Decus World
        </p>

        <h1 className="mt-3 font-heading text-4xl font-semibold tracking-tight">
          Welcome back
        </h1>

        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Sign in to manage your orders, wishlist, profile, and checkout faster.
        </p>
      </div>

      <div className="rounded-3xl border bg-background/95 p-6 shadow-sm md:p-8">
        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-5">
          <div className="space-y-2">
            <RequiredLabel>Email address</RequiredLabel>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                name="decus-login-user"
                type="email"
                placeholder="you@example.com"
                value={email}
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 rounded-xl pl-11"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <RequiredLabel>Password</RequiredLabel>

            <div className="relative">
              <LockKeyhole className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                name="decus-login-secret"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                autoComplete="new-password"
                autoCorrect="off"
                spellCheck={false}
                onChange={(e) => setPassword(e.target.value)}
                className="h-10 rounded-xl pl-11 pr-11"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            <div className="text-right">
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <Button
            className="h-10 w-full rounded-full bg-zinc-950 text-white hover:bg-zinc-800"
            disabled={isPending}
            type="submit"
          >
            {isPending ? "Signing in..." : "Sign in"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            New to Decus World?{" "}
            <Link href="/register" className="font-semibold text-foreground">
              Create an account
            </Link>
          </p>
        </form>
      </div>

      <p className="mt-6 text-center text-xs leading-5 text-muted-foreground">
        By signing in, you can access your saved wishlist, order history, and
        faster checkout experience.
      </p>
    </div>
  );
}
