import { Home, SearchX } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/shared/back-button";

export default function NotFound() {
  return (
    <main className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="mx-auto max-w-xl text-center">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-muted">
          <SearchX className="h-12 w-12 text-muted-foreground" />
        </div>

        <p className="mt-8 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Error 404
        </p>

        <h1 className="mt-2 text-4xl font-bold">Page not found</h1>

        <p className="mt-4 text-muted-foreground">
          Sorry, we couldn't find the page you're looking for. It may have been
          moved, deleted, or the URL is incorrect.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button>
            <Link href="/" className="flex items-center">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>

          <Button variant="outline">
            <Link href="/products">Browse Products</Link>
          </Button>

          <BackButton />
        </div>
      </div>
    </main>
  );
}
