import Link from "next/link";

import { Button } from "@/components/ui/button";

type CheckoutSuccessPageProps = {
  searchParams: Promise<{
    order?: string;
  }>;
};

export default async function CheckoutSuccessPage({
  searchParams,
}: CheckoutSuccessPageProps) {
  const { order } = await searchParams;

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-bold">Order placed successfully</h1>

      <p className="mt-4 text-muted-foreground">
        Your Cash on Delivery order has been placed.
      </p>

      {order ? (
        <p className="mt-3 rounded-lg bg-muted px-4 py-2 text-sm">
          Order Number: <strong>{order}</strong>
        </p>
      ) : null}

      <div className="mt-8 flex gap-3">
        <Button>
          <Link href="/account/orders">View Orders</Link>
        </Button>

        <Button variant="outline">
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>
    </main>
  );
}