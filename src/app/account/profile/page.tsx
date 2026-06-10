import { auth } from "../../../../auth";

export default async function ProfilePage() {
  const session = await auth();

  return (
    <div className="rounded-xl border bg-background p-6">
      <h1 className="text-2xl font-bold">My Profile</h1>

      <div className="mt-6 space-y-2 text-sm">
        <p>Name: {session?.user.name}</p>
        <p>Email: {session?.user.email}</p>
        <p>Role: {session?.user.role}</p>
      </div>
    </div>
  );
}