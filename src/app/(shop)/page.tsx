import Link from "next/link";

import { ProductGrid } from "@/components/product/product-grid";
import { Button } from "@/components/ui/button";
import { HomeHeroSlider } from "@/features/home/home-hero-slider";
import { HomeSectionBanner } from "@/features/home/home-section-banner";
import { getActiveBanners } from "@/server/queries/banner-queries";
import { getFeaturedProducts } from "@/server/queries/product-queries";

export default async function HomePage() {
  const [featuredProducts, heroBanners, sectionBanners] = await Promise.all([
    getFeaturedProducts(),
    getActiveBanners("HOME_HERO"),
    getActiveBanners("HOME_SECTION"),
  ]);

  const homeSectionBanner = sectionBanners[0] || null;

  return (
    <main>
      <HomeHeroSlider banners={heroBanners} />

      <HomeSectionBanner banner={homeSectionBanner} />

      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Featured
            </p>
            <h2 className="mt-2 sm:text-3xl text-2xl font-bold">Featured Products</h2>
          </div>

          <Button variant="outline" className="h-10 rounded-full px-6 text-sm">
            <Link href="/products">View All</Link>
          </Button>
        </div>

        <ProductGrid products={featuredProducts} />
      </section>
    </main>
  );
}
