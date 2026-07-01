"use server";

import bcrypt from "bcryptjs";
import crypto from "crypto";

import { emailConfig } from "@/config/email";
import { prisma } from "@/lib/prisma";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@/lib/validations/password-reset";
import { sendPasswordResetEmail } from "@/server/services/email-service";

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function forgotPasswordAction(values: unknown) {
  const parsed = forgotPasswordSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      message: "Valid email is required",
    };
  }

  const { email } = parsed.data;

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
    },
  });

  // Security: do not reveal if email exists or not.
  if (!user) {
    return {
      success: true,
      message: "If your email exists, a reset link has been sent.",
    };
  }

  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = hashToken(rawToken);

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      passwordResetToken: hashedToken,
      passwordResetExpiresAt: new Date(Date.now() + 1000 * 60 * 30),
    },
  });

  const resetUrl = `${emailConfig.appUrl}/reset-password?token=${rawToken}`;

  await sendPasswordResetEmail({
    email: user.email,
    resetUrl,
  });

  return {
    success: true,
    message: "If your email exists, a reset link has been sent.",
  };
}

export async function resetPasswordAction(values: unknown) {
  const parsed = resetPasswordSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid reset request",
    };
  }

  const { token, password } = parsed.data;
  const hashedToken = hashToken(token);

  const user = await prisma.user.findFirst({
    where: {
      passwordResetToken: hashedToken,
      passwordResetExpiresAt: {
        gt: new Date(),
      },
    },
  });

  if (!user) {
    return {
      success: false,
      message: "Reset link is invalid or expired",
    };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetExpiresAt: null,
    },
  });

  return {
    success: true,
    message: "Password reset successfully. You can login now.",
  };
}