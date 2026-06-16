"use server";

import bcrypt from "bcryptjs";
import AuthError from "next-auth";

import { signIn, signOut } from "../../../auth";
import { prisma } from "@/lib/prisma";
import { loginSchema, registerSchema } from "@/lib/validations/auth";

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

  const user = await prisma.user.findUnique({
    where: { email },
    select: { role: true },
  });

  const redirectTo =
    user?.role === "ADMIN" || user?.role === "STAFF"
      ? "/admin/dashboard"
      : "/account/profile";

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