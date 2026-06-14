import { redirect } from "next/navigation";

import { auth } from "../../../../auth";
import { LoginForm } from "@/features/auth/login-form";

export default async function LoginPage() {
  const session = await auth();
  console.log("Session:", session);
  if (session?.user) {
    redirect("/admin/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted px-4">
      <LoginForm />
    </main>
  );
}