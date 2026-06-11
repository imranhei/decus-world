"use server";

import { revalidatePath } from "next/cache";

import { auth } from "../../../auth";
import { prisma } from "@/lib/prisma";
import { profileSchema } from "@/lib/validations/profile";

export async function updateProfileAction(values: unknown) {
  const session = await auth();

  if (!session?.user) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  const parsed = profileSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid profile data",
    };
  }

  const data = parsed.data;

  await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      name: data.name,
      phone: data.phone || null,
      address: data.address || null,
      city: data.city || null,
      postalCode: data.postalCode || null,
    },
  });

  revalidatePath("/account/profile");
  revalidatePath("/checkout");

  return {
    success: true,
    message: "Profile updated successfully",
  };
}