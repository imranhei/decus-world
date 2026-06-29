import { redirect } from "next/navigation";

import { auth } from "../../../../auth";
import { LoginForm } from "@/features/auth/login-form";

type LoginPageProps = {
  searchParams: Promise<{
    callbackUrl?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await auth();
  const { callbackUrl } = await searchParams;

  if (session?.user) {
    redirect(callbackUrl || "/account/profile");
  }

  return <LoginForm callbackUrl={callbackUrl} />;
}