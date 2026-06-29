import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen">
      <section className="hidden flex-1 bg-zinc-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <Link href="/" className="text-2xl font-bold">
          Decus World
        </Link>

        <div>
          <h1 className="max-w-md text-4xl font-bold">
            Premium fashion for modern lifestyle.
          </h1>
          <p className="mt-4 max-w-md text-zinc-300">
            Manage orders, wishlist, profile, and checkout faster with your
            account.
          </p>
        </div>

        <p className="text-sm text-zinc-400">
          © {new Date().getFullYear()} Decus World
        </p>
      </section>

      <section className="relative flex flex-1 items-center justify-center bg-muted px-4 py-10">
        <Link
          href="/"
          className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border bg-background px-4 py-2 text-sm font-medium shadow-sm transition hover:bg-muted lg:hidden"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to shop
        </Link>

        {children}
      </section>
    </main>
  );
}
