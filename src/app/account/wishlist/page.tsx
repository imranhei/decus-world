import Link from "next/link";

import { getCurrentUserWishlist } from "@/server/queries/wishlist-queries";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";

export default async function WishlistPage() {
  const wishlist = await getCurrentUserWishlist();

  if (!wishlist.length) {
    return (
      <div className="rounded-xl border bg-background p-10 text-center">
        <h1 className="text-2xl font-bold">Your wishlist is empty</h1>
        <p className="mt-2 text-muted-foreground">
          Save your favorite products and find them here later.
        </p>

        <Button className="h-10 mt-6 rounded-full px-6 text-sm">
          <Link href="/products">Browse Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">My Wishlist</h1>
        <p className="mt-1 text-muted-foreground">
          Your saved favorite products.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {wishlist.map((item) => (
          <ProductCard
            key={item.id}
            product={item.product}
            isLoggedIn
            isWishlisted
          />
        ))}
      </div>
    </div>
  );
}