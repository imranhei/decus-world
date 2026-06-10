import Link from "next/link";

import { auth } from "../../../auth";
import { Button } from "@/components/ui/button";

export async function AdminTopbar() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4 lg:pl-80">
      <div>
        <p className="text-sm text-muted-foreground">Admin Panel</p>
        <p className="font-medium">{session?.user.name}</p>
      </div>

      <Button variant="outline">
        <Link href="/">View Store</Link>
      </Button>
    </header>
  );
}