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
            Manage orders, wishlist, profile, and checkout faster with your account.
          </p>
        </div>

        <p className="text-sm text-zinc-400">© 2026 Decus World</p>
      </section>

      <section className="flex flex-1 items-center justify-center bg-muted px-4">
        {children}
      </section>
    </main>
  );
}