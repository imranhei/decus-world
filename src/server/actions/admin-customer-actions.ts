"use server";

import { revalidatePath } from "next/cache";
import type { Role } from "@prisma/client";

import { auth } from "../../../auth";
import { prisma } from "@/lib/prisma";

export async function updateUserRoleAction({
  userId,
  role,
}: {
  userId: string;
  role: Role;
}) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return {
      success: false,
      message: "Only admins can change user roles",
    };
  }

  if (session.user.id === userId && role !== "ADMIN") {
    return {
      success: false,
      message: "You cannot remove your own admin access",
    };
  }

  await prisma.user.update({
    where: { id: userId },
    data: { role },
  });

  revalidatePath("/admin/customers");
  revalidatePath(`/admin/customers/${userId}`);

  return {
    success: true,
    message: "User role updated",
  };
}