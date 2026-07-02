import Image from "next/image";
import Link from "next/link";

import { Pagination } from "@/components/shared/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deleteProductAction } from "@/server/actions/admin-product-actions";
import { getAdminProducts } from "@/server/queries/admin-product-queries";

type PageProps = {
  searchParams: Promise<{
    page?: string;
  }>;
};

export default async function AdminProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page || 1);

  const productResult = await getAdminProducts({ page, limit: 10 });
  const products = productResult.products;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="mt-1 text-muted-foreground">
            Manage products, variants, inventory, and images.
          </p>
        </div>

        <Button className="h-10 rounded-full px-6 text-sm">
          <Link href="/admin/products/new">Add Product</Link>
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border bg-background">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted">
            <tr>
              <th className="px-2 py-2 text-left">Product</th>
              <th className="px-2 py-2 text-left">Category</th>
              <th className="px-2 py-2 text-left">Price</th>
              <th className="px-2 py-2 text-left">Stock</th>
              <th className="px-2 py-2 text-left">Status</th>
              <th className="px-2 py-2 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => {
              const stock = product.variants.reduce(
                (total, variant) => total + (variant.inventory?.quantity || 0),
                0,
              );

              return (
                <tr key={product.id} className="border-b last:border-0">
                  <td className="px-2 py-2">
                    <div className="flex items-center gap-3">
                      <div className="relative h-14 w-12 overflow-hidden rounded bg-muted">
                        {product.images[0] ? (
                          <Image
                            src={product.images[0].url}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        ) : null}
                      </div>

                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {product.slug}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-2 py-2">{product.category.name}</td>
                  <td className="px-2 py-2">৳{Number(product.price)}</td>
                  <td className="px-2 py-2">
                    <div className="grid max-w-xs grid-cols-2 gap-1">
                      {product.variants.map((variant) => (
                        <span
                          key={variant.id}
                          className="rounded-md bg-muted px-2 py-1 text-xs font-medium"
                        >
                          {variant.size || "Default"}:{" "}
                          {variant.inventory?.quantity || 0}
                          {variant.color ? ` (${variant.color})` : ""}
                        </span>
                      ))}
                    </div>

                    <div className="mt-2 px-2 text-xs font-semibold text-green-600">
                      Total Stock: {stock}
                    </div>
                  </td>

                  <td className="px-2 py-2">
                    <Badge>{product.status}</Badge>
                  </td>

                  <td className="px-2 py-2 text-right">
                    <div className="flex justify-end gap-2 flex-wrap">
                      <Button size="sm" variant="outline">
                        <Link href={`/admin/products/${product.id}/edit`}>
                          Edit
                        </Link>
                      </Button>

                      <form
                        action={async () => {
                          "use server";
                          await deleteProductAction(product.id);
                        }}
                      >
                        <Button size="sm" variant="destructive" type="submit">
                          Archive
                        </Button>
                      </form>
                    </div>
                  </td>
                </tr>
              );
            })}

            {!products.length ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-2 py-10 text-center text-muted-foreground"
                >
                  No products found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>

        <Pagination
          page={productResult.page}
          totalPages={productResult.totalPages}
          basePath="/admin/products"
          searchParams={params}
        />
      </div>
    </div>
  );
}
