import { redirect } from "next/navigation";

import { auth } from "../../../../auth";
import { LoginForm } from "@/features/auth/login-form";

export default async function LoginPage() {
  const session = await auth();

  if (session?.user.role === "ADMIN" || session?.user.role === "STAFF") {
    redirect("/admin/dashboard");
  }

  if (session?.user) {
    redirect("/account/profile");
  }

  return <LoginForm />
}