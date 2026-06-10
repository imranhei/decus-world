import { ProductGrid } from "@/components/product/product-grid";
import { getProducts } from "@/server/queries/product-queries";

export const metadata = {
  title: "Products",
  description: "Shop premium clothing products.",
};

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Products</h1>
        <p className="mt-2 text-muted-foreground">
          Explore our latest clothing collection.
        </p>
      </div>

      <ProductGrid products={products} />
    </main>
  );
}