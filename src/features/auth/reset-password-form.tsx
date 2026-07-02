"use client";

import Link from "next/link";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { RequiredLabel } from "@/components/shared/required-label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { resetPasswordAction } from "@/server/actions/password-reset-actions";

export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(async () => {
      const result = await resetPasswordAction({
        token,
        password,
      });

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      router.push("/login");
    });
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.35em] text-muted-foreground">
          Decus World
        </p>

        <h1 className="mt-3 font-heading text-4xl font-semibold">
          Reset password
        </h1>

        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Create a new password for your account.
        </p>
      </div>

      <div className="rounded-3xl border bg-background/95 p-6 shadow-sm md:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <RequiredLabel>New password</RequiredLabel>

            <div className="relative">
              <LockKeyhole className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Minimum 8 characters"
                className="h-10 rounded-xl pl-11 pr-11"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="h-10 w-full rounded-full bg-zinc-950 text-white hover:bg-zinc-800"
          >
            {isPending ? "Resetting..." : "Reset password"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Back to{" "}
            <Link href="/login" className="font-semibold text-foreground">
              sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}