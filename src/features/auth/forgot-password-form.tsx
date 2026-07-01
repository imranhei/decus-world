"use client";

import Link from "next/link";
import { Mail } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { RequiredLabel } from "@/components/shared/required-label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { forgotPasswordAction } from "@/server/actions/password-reset-actions";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(async () => {
      const result = await forgotPasswordAction({ email });

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.35em] text-muted-foreground">
          Decus World
        </p>

        <h1 className="mt-3 font-heading text-4xl font-semibold">
          Forgot password
        </h1>

        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Enter your email and we will send you a secure reset link.
        </p>
      </div>

      <div className="rounded-3xl border bg-background/95 p-6 shadow-sm md:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <RequiredLabel>Email address</RequiredLabel>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="h-10 rounded-xl pl-11"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="h-10 w-full rounded-xl bg-zinc-950 text-white hover:bg-zinc-800"
          >
            {isPending ? "Sending..." : "Send reset link"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Remember password?{" "}
            <Link href="/login" className="font-semibold text-foreground">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}