import Link from "next/link";

import { ProductGrid } from "@/components/product/product-grid";
import { Button } from "@/components/ui/button";
import { getActiveBanner } from "@/server/queries/banner-queries";
import { getFeaturedProducts } from "@/server/queries/product-queries";
import Image from "next/image";

export default async function HomePage() {
  const [featuredProducts, heroBanner] = await Promise.all([
    getFeaturedProducts(),
    getActiveBanner("HOME_HERO"),
  ]);

  return (
    <main>
      <section className="bg-zinc-950 text-white">
        <div className="mx-auto grid min-h-130 max-w-7xl items-center gap-10 px-4 py-20 lg:grid-cols-2">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-zinc-400">
              New Collection
            </p>

            <h1 className="font-inter mt-4 max-w-2xl text-5xl font-bold tracking-tight lg:text-7xl">
              Premium fashion for everyday confidence.
            </h1>

            <p className="mt-6 max-w-xl text-lg text-zinc-300">
              Discover modern clothing designed for comfort, quality, and
              timeless style.
            </p>

            <div className="mt-8 flex gap-3">
              <Button size="lg">
                <Link href="/products">Shop Now</Link>
              </Button>

              <Button size="lg" variant="outline" className="bg-zinc-500">
                <Link href="/products?category=new">New Arrivals</Link>
              </Button>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl bg-white/10">
            <div className="relative aspect-square">
              {heroBanner ? (
                <Image
                  src={heroBanner.imageUrl}
                  alt={heroBanner.title}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="h-full w-full bg-white/10" />
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Featured
            </p>
            <h2 className="mt-2 text-3xl font-bold">Featured Products</h2>
          </div>

          <Button variant="outline">
            <Link href="/products">View All</Link>
          </Button>
        </div>

        <ProductGrid products={featuredProducts} />
      </section>
    </main>
  );
}
