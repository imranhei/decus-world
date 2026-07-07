import Image from "next/image";
import Link from "next/link";

import { DataTable } from "@/components/shared/data-table/data-table";
import { DataTableBody } from "@/components/shared/data-table/data-table-body";
import { DataTableHeader } from "@/components/shared/data-table/data-table-header";
import { DataTableMobile } from "@/components/shared/data-table/data-table-mobile";
import { MobileCard } from "@/components/shared/data-table/mobile-card";
import { TableEmpty } from "@/components/shared/data-table/table-empty";
import { Pagination } from "@/components/shared/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductActionMenu } from "@/features/products/table-action-menu";
import { getCloudinaryImageUrl } from "@/lib/cloudinary-image";
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

      <>
        {/* Desktop */}
        <DataTable minWidth="800px">
          <DataTableHeader
            columns={[
              { title: "Product" },
              { title: "Category" },
              { title: "Price" },
              { title: "Stock" },
              { title: "Status" },
              { title: "Action", align: "right", width: "70px" },
            ]}
          />

          <DataTableBody>
            {products.map((product) => {
              const stock = product.variants.reduce(
                (total, variant) => total + (variant.inventory?.quantity || 0),
                0,
              );

              return (
                <tr
                  key={product.id}
                  className="border-b transition hover:bg-muted/40"
                >
                  <td className="p-2">
                    <div className="flex items-center gap-3">
                      <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded border bg-muted">
                        {product.images[0] ? (
                          <Image
                            src={getCloudinaryImageUrl(
                              product.images[0].url,
                              128,
                              96,
                            )}
                            alt={product.name}
                            fill
                            sizes="64px"
                            className="object-cover object-center"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                            N/A
                          </div>
                        )}
                      </div>

                      <div>
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="font-medium hover:underline"
                        >
                          {product.name}
                        </Link>

                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {product.slug}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3">{product.category.name}</td>

                  <td className="px-4 py-3 font-semibold">
                    ৳{Number(product.price).toLocaleString()}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {product.variants.map((variant) => (
                        <Badge
                          key={variant.id}
                          variant="secondary"
                          className="text-xs gap-2"
                        >
                          {variant.size || "Default"} :{" "}
                          {variant.inventory?.quantity || 0}
                          {" - "}
                          {variant?.color || ""}
                        </Badge>
                      ))}
                    </div>

                    <p className="mt-2 text-xs font-medium text-green-600">
                      Total: {stock}
                    </p>
                  </td>

                  <td className="px-4 py-3">
                    <Badge>{product.status}</Badge>
                  </td>

                  <td className="px-4 py-3 text-right">
                    <ProductActionMenu
                      productId={product.id}
                      productName={product.name}
                    />
                  </td>
                </tr>
              );
            })}

            {!products.length && (
              <TableEmpty
                colSpan={6}
                title="No products found"
                description="Create your first product to get started."
              />
            )}
          </DataTableBody>
        </DataTable>

        {/* Mobile */}
        <DataTableMobile>
          {products.map((product) => {
            const stock = product.variants.reduce(
              (total, variant) => total + (variant.inventory?.quantity || 0),
              0,
            );

            return (
              <MobileCard key={product.id}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-3">
                    <div className="relative h-16 w-14 overflow-hidden rounded-lg bg-muted">
                      {product.images[0] && (
                        <Image
                          src={product.images[0].url}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>

                    <div>
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="font-semibold hover:underline line-clamp-1"
                      >
                        {product.name}
                      </Link>

                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {product.slug}
                      </p>

                      <Badge className="md:mt-2 text-[10px]">
                        {product.status}
                      </Badge>
                    </div>
                  </div>

                  <ProductActionMenu
                    productId={product.id}
                    productName={product.name}
                  />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl bg-muted/60 p-3">
                    <p className="text-xs text-muted-foreground">Category</p>

                    <p className="mt-1 font-medium">{product.category.name}</p>
                  </div>

                  <div className="rounded-xl bg-muted/60 p-3">
                    <p className="text-xs text-muted-foreground">Price</p>

                    <p className="mt-1 font-semibold">
                      ৳{Number(product.price).toLocaleString()}
                    </p>
                  </div>

                  <div className="col-span-2 rounded-xl bg-muted/60 p-3">
                    <p className="text-xs text-muted-foreground">Stock</p>

                    <div className="mt-2 flex flex-wrap gap-1">
                      {product.variants.map((variant) => (
                        <Badge
                          key={variant.id}
                          variant="secondary"
                          className="text-xs"
                        >
                          {variant.size || "Default"} :{" "}
                          {variant.inventory?.quantity || 0}
                        </Badge>
                      ))}
                    </div>

                    <p className="mt-2 text-xs font-semibold text-green-600">
                      Total Stock: {stock}
                    </p>
                  </div>
                </div>
              </MobileCard>
            );
          })}
        </DataTableMobile>

        <Pagination
          page={productResult.page}
          totalPages={productResult.totalPages}
          basePath="/admin/products"
          searchParams={params}
        />
      </>
    </div>
  );
}
