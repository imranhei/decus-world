import { redirect } from "next/navigation";

import { auth } from "../../../../auth";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "@/features/account/profile-form";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      name: true,
      email: true,
      phone: true,
      address: true,
      city: true,
      postalCode: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="mt-1 text-muted-foreground">
          Update your contact and shipping information.
        </p>
      </div>

      <ProfileForm user={user} />
    </div>
  );
}