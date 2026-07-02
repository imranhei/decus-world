import Link from "next/link";

import { auth } from "../../../auth";
import { Button } from "@/components/ui/button";
import { Store } from "lucide-react";

export async function AdminTopbar() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4 lg:pl-64">
      <div className="lg:ml-0 ml-12">
        <p className="text-muted-foreground">Admin Panel</p>
      </div>

      <Button variant="outline" className="h-10 rounded-full px-6 text-sm gap-2 text-teal-500">
       <Store /> <Link href="/">View Store</Link>
      </Button>
    </header>
  );
}
