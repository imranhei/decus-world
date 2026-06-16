import { redirect } from "next/navigation";

import { auth } from "../../../auth";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { AdminTopbar } from "@/components/layout/admin-topbar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN" && session.user.role !== "STAFF") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <AdminSidebar />
      <AdminTopbar />

      <main className="p-4 lg:pl-60">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
}