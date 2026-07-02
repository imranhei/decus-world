import Link from "next/link";

import { auth } from "../../../auth";
import { Button } from "@/components/ui/button";
import { Store } from "lucide-react";

export async function AdminTopbar() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background sm:px-4 px-2 lg:pl-64">
      <div className="lg:ml-0 ml-12">
        <p className="text-muted-foreground sm:text-base text-sm">Admin Panel</p>
      </div>

      <Button variant="outline" className="sm:h-10 h-7 rounded-full sm:px-6 px-4 sm:text-sm text-xs gap-2 text-teal-500">
       <Store className="sm:size-4 size-3.5" /> <Link href="/">View Store</Link>
      </Button>
    </header>
  );
}
