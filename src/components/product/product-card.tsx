import type { Category, Product, ProductImage } from "@prisma/client";
import { ChevronRight, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { WishlistButton } from "@/features/wishlist/wishlist-button";
import { auth } from "../../../auth";
import { Button } from "../ui/button";

type ProductCardProps = {
  product: Product & {
    images: ProductImage[];
    category: Category;
  };
  isLoggedIn?: boolean;
  isWishlisted?: boolean;
};

export async function ProductCard({
  product,
  isWishlisted = false,
}: ProductCardProps) {
  const session = await auth();
  const image = product.images[0];

  return (
    <article className="group overflow-hidden sm:rounded-3xl rounded-xl border bg-background shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-square overflow-hidden bg-muted">
        {image ? (
          <Image
            src={image.url}
            alt={image.altText || product.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            No image
          </div>
        )}

        <div className="absolute right-4 top-4 z-10">
          <WishlistButton
            productId={product.id}
            isLoggedIn={Boolean(session?.user)}
            initialWishlisted={isWishlisted}
          />
        </div>
      </div>

      <div className="sm:p-5 p-2">
        <h3 className="line-clamp-1 sm:text-base text-sm font-semibold">
          {product.name}
        </h3>

        <div className="mt-2 flex flex-wrap gap-1">
          <span className="rounded border px-2 py-0.5 text-[10px] font-medium uppercase text-muted-foreground">
            {product.category.name}
          </span>

          {product.isNewArrival ? (
            <span className="rounded border px-2 py-0.5 text-[10px] font-medium uppercase text-muted-foreground">
              New
            </span>
          ) : null}
        </div>

        {product.shortDescription ? (
          <p className="sm:mt-3 mt-2 line-clamp-2 h-10 text-xs leading-5 text-muted-foreground">
            {product.shortDescription}
          </p>
        ) : null}

        <div className="sm:mt-5 mt-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase text-muted-foreground">
              Price
            </p>

            <p className="sm:text-lg font-bold">
              ৳{Number(product.price).toLocaleString("en-US")}
            </p>
          </div>

          <Link
            href={`/products/${product.slug}`}
            className="flex items-center sm:gap-2 gap-0 sm:text-sm text-xs font-medium text-teal-500 transition-all sm:group-hover:gap-3 group-hover:gap-1"
          >
            <span className="sm:block hidden">View Details</span>{" "}
            <Button
              variant="outline"
              size="sm"
              className="sm:hidden p-2 rounded-full flex items-center justify-center text-xs gap-2"
            >
              <ShoppingCart size={16} /> SHOP
            </Button>
            <ChevronRight className="h-4 w-4 sm:block hidden" />
          </Link>
        </div>
      </div>
    </article>
  );
}
