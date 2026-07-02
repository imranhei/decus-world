import type { Category, Product, ProductImage } from "@prisma/client";

// import { ProductCard } from "@/components/product/product-card";
import { FeaturedProductSlider } from "@/components/product/featured-product-slider";

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
    <div className="grid sm:gap-6 gap-2 grid-cols-1! lg:grid-cols-4">
      {/* {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))} */}
      <FeaturedProductSlider products={products} />
    </div>
  );
}