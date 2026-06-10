import type { Category, Product, ProductImage } from "@prisma/client";

import { ProductCard } from "@/components/product/product-card";

type ProductGridProps = {
  products: Array<
    Product & {
      images: ProductImage[];
      category: Category;
    }
  >;
};

export function ProductGrid({ products }: ProductGridProps) {
  if (!products.length) {
    return (
      <div className="rounded-xl border bg-background p-10 text-center">
        <p className="text-muted-foreground">No products found.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}