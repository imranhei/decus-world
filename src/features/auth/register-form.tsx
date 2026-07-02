"use client";

import Link from "next/link";
import { Eye, EyeOff, LockKeyhole, Mail, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { RequiredLabel } from "@/components/shared/required-label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerAction } from "@/server/actions/auth-actions";

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
        const message = result?.message || "Something went wrong";
        setError(message);
        toast.error(message);
        return;
      }

      toast.success("Account created successfully");
      router.push("/login");
    });
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.35em] text-muted-foreground">
          Decus World
        </p>

        <h1 className="mt-3 font-heading text-4xl font-semibold tracking-tight">
          Create account
        </h1>

        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Join Decus World to save your wishlist, track orders, and checkout
          faster.
        </p>
      </div>

      <div className="rounded-3xl border bg-background/95 p-6 shadow-sm md:p-8">
        <form action={handleSubmit} autoComplete="off" className="space-y-5">
          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          ) : null}

          <div className="space-y-2">
            <RequiredLabel>Full name</RequiredLabel>

            <div className="relative">
              <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                name="name"
                placeholder="Your name"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                className="h-10 rounded-xl pl-11"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <RequiredLabel>Email address</RequiredLabel>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                name="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
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
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Minimum 8 characters"
                autoComplete="new-password"
                autoCorrect="off"
                spellCheck={false}
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
          </div>

          <Button
            className="h-10 w-full rounded-full bg-zinc-950 text-white hover:bg-zinc-800"
            disabled={isPending}
            type="submit"
          >
            {isPending ? "Creating account..." : "Create account"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-foreground">
              Sign in
            </Link>
          </p>
        </form>
      </div>

      <p className="mt-6 text-center text-xs leading-5 text-muted-foreground">
        Create your account to enjoy a smoother premium shopping experience.
      </p>
    </div>
  );
}