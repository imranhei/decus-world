import { redirect } from "next/navigation";

import { auth } from "../../../../auth";
import { RegisterForm } from "@/features/auth/register-form";

export default async function RegisterPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/account/profile");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted px-4">
      <RegisterForm />
    </main>
  );
}