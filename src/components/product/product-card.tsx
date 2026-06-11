import type { Category, Product, ProductImage } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
    <Link href={`/products/${product.slug}`}>
      <Card className="group overflow-hidden rounded-2xl transition hover:shadow-md">
        <div className="relative aspect-3/4 overflow-hidden bg-muted">
          <div className="absolute right-3 top-3">
            <WishlistButton
              productId={product.id}
              isLoggedIn={isLoggedIn}
              initialWishlisted={isWishlisted}
            />
          </div>
          {image ? (
            <Image
              src={image.url}
              alt={image.altText || product.name}
              fill
              className="object-cover transition duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              No image
            </div>
          )}

          {product.isNewArrival ? (
            <Badge className="absolute left-3 top-3">New</Badge>
          ) : null}
        </div>

        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground">
            {product.category.name}
          </p>
          <h3 className="mt-1 line-clamp-1 font-semibold">{product.name}</h3>

          <div className="mt-2 flex items-center gap-2">
            <p className="font-bold">৳{Number(product.price)}</p>

            {product.compareAtPrice ? (
              <p className="text-sm text-muted-foreground line-through">
                ৳{Number(product.compareAtPrice)}
              </p>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
