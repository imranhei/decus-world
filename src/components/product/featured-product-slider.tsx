import { ProductCard } from "@/components/product/product-card";
import {
  FeaturedProductSlide,
  FeaturedProductSliderShell,
} from "@/components/product/featured-product-slider-shell";

type FeaturedProductSliderProps = {
  products: any[];
};

export function FeaturedProductSlider({ products }: FeaturedProductSliderProps) {
  if (!products.length) {
    return (
      <div className="rounded-xl border bg-background p-10 text-center">
        <p className="text-muted-foreground">No featured products found.</p>
      </div>
    );
  }

  return (
    <FeaturedProductSliderShell>
      {products.map((product, index) => (
        <FeaturedProductSlide key={product.id} index={index}>
          <ProductCard product={product} />
        </FeaturedProductSlide>
      ))}
    </FeaturedProductSliderShell>
  );
}