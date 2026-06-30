import { ProductGrid } from "@/components/product/product-grid";
import { Pagination } from "@/components/shared/pagination";
import { ProductFilters } from "@/features/products/product-filters";
import {
  getActiveCategories,
  getProducts,
} from "@/server/queries/product-queries";

import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/config/site";
import { createCollectionJsonLd } from "@/lib/seo";
import { BackButton } from "@/components/shared/back-button";

export const metadata = {
  title: "Products",
  description: "Shop premium clothing products.",
};

type ProductsPageProps = {
  searchParams: Promise<{
    search?: string;
    category?: string;
    sort?: string;
    featured?: string;
    newArrival?: string;
    bestSeller?: string;
    page?: string;
  }>;
};

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = await searchParams;

  const [productResult, categories] = await Promise.all([
    getProducts(params),
    getActiveCategories(),
  ]);

  const collectionJsonLd = createCollectionJsonLd({
    name: "Products",
    description: "Shop premium clothing products.",
    url: `${siteConfig.url}/products`,
  });

  return (
    <>
      <JsonLd data={collectionJsonLd} />
      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-8 flex justify-between">
          <div>
            <h1 className="text-3xl font-bold">Products</h1>
            <p className="mt-2 text-muted-foreground">
              Showing {productResult.totalProducts} products.
            </p>
          </div>

          <BackButton />
        </div>

        <ProductFilters categories={categories} />

        <ProductGrid products={productResult.products} />

        <Pagination
          page={productResult.page}
          totalPages={productResult.totalPages}
          basePath="/products"
          searchParams={params}
        />
      </main>
    </>
  );
}
