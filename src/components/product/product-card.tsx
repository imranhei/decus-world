import type { Category, Product, ProductImage } from "@prisma/client";
import { Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { WishlistButton } from "@/features/wishlist/wishlist-button";

type ProductCardProps = {
  product: Product & {
    images: ProductImage[];
    category: Category;
  };
  isLoggedIn?: boolean;
  isWishlisted?: boolean;
};

export function ProductCard({
  product,
  isLoggedIn = false,
  isWishlisted = false,
}: ProductCardProps) {
  const image = product.images[0];

  return (
    <article className="group overflow-hidden rounded-3xl border bg-background shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
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
            isLoggedIn={isLoggedIn}
            initialWishlisted={isWishlisted}
          />
        </div>
      </div>

      <div className="p-5">
        <h3 className="line-clamp-1 text-base font-semibold">{product.name}</h3>

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
          <p className="mt-3 line-clamp-2 text-xs leading-5 text-muted-foreground">
            {product.shortDescription}
          </p>
        ) : null}

        <div className="mt-5 flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase text-muted-foreground">
              Price
            </p>

            <p className="text-lg font-bold">
              ৳{Number(product.price).toLocaleString("en-US")}
            </p>
          </div>

          <Button size="sm" className="rounded-lg px-4">
            <Link href={`/products/${product.slug}`} className="flex items-center">
              <Eye className="mr-2 h-4 w-4" />
              View
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
