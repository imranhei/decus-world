"use server";

import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { loginSchema, registerSchema } from "@/lib/validations/auth";
import { signIn, signOut } from "../../../auth";

export async function registerAction(values: unknown) {
  const validatedFields = registerSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Invalid fields",
    };
  }

  const { name, email, password } = validatedFields.data;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return {
      success: false,
      message: "Email already exists",
    };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: "CUSTOMER",
    },
  });

  return {
    success: true,
    message: "Account created successfully",
  };
}

export async function loginAction(values: unknown) {
  const validatedFields = loginSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Invalid fields",
    };
  }

  const { email, password } = validatedFields.data;

  const callbackUrl =
    typeof (values as { callbackUrl?: unknown }).callbackUrl === "string"
      ? (values as { callbackUrl: string }).callbackUrl
      : undefined;

  const user = await prisma.user.findUnique({
    where: { email },
    select: { role: true },
  });

  const fallbackRedirectTo =
    user?.role === "ADMIN" || user?.role === "STAFF"
      ? "/admin/dashboard"
      : "/account/profile";

  const redirectTo = callbackUrl || fallbackRedirectTo;

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo,
    });

    return {
      success: true,
      message: "Logged in successfully",
    };
  } catch (error) {
    const authError = error as Error & {
      type?: string;
      code?: string;
      digest?: string;
    };

    if (
      authError.type === "CredentialsSignin" ||
      authError.code === "credentials"
    ) {
      return {
        success: false,
        message: "Invalid email or password",
      };
    }

    throw error;
  }
}

export async function logoutAction() {
  await signOut({
    redirectTo: "/login",
  });
}
