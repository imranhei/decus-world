import { redirect } from "next/navigation";

import { RegisterForm } from "@/features/auth/register-form";
import { auth } from "../../../../auth";

export default async function RegisterPage() {
  const session = await auth();

  if (session?.user.role === "ADMIN" || session?.user.role === "STAFF") {
    redirect("/admin/dashboard");
  }

  if (session?.user) {
    redirect("/account/profile");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted px-4">
      <RegisterForm />
    </main>
  );
}
