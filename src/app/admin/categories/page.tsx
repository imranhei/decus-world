import Image from "next/image";
import Link from "next/link";

import { DataTable } from "@/components/shared/data-table/data-table";
import { DataTableBody } from "@/components/shared/data-table/data-table-body";
import { DataTableHeader } from "@/components/shared/data-table/data-table-header";
import { DataTableMobile } from "@/components/shared/data-table/data-table-mobile";
import { MobileCard } from "@/components/shared/data-table/mobile-card";
import { TableEmpty } from "@/components/shared/data-table/table-empty";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CategoryActionMenu } from "@/features/category/category-action-menu";
import { getAdminCategories } from "@/server/queries/admin-category-queries";

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="mt-1 text-muted-foreground">
            Manage product categories and parent categories.
          </p>
        </div>

        <Button className="h-10 rounded-full px-6 text-sm">
          <Link href="/admin/categories/new">Add Category</Link>
        </Button>
      </div>

      <>
        {/* Desktop */}
        <DataTable minWidth="700px">
          <DataTableHeader
            columns={[
              { title: "Category" },
              { title: "Parent" },
              { title: "Products" },
              { title: "Status" },
              { title: "Action", align: "right", width: "70px" },
            ]}
          />
          <DataTableBody>
            {categories.map((category) => (
              <tr
                key={category.id}
                className="border-b transition hover:bg-muted/40"
              >
                <td className="p-2">
                  <div className="flex items-center gap-3">
                    <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded border bg-muted">
                      {category.imageUrl ? (
                        <Image
                          src={category.imageUrl}
                          alt={category.name}
                          fill
                          sizes="56px"
                          className="object-cover object-center"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                          N/A
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <Link
                        href={`/admin/categories/${category.id}/edit`}
                        className="line-clamp-1 font-medium hover:underline"
                      >
                        {category.name}
                      </Link>
                      <p className="line-clamp-1 text-xs text-muted-foreground">
                        {category.slug}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="font-medium">
                    {category.parent?.name || "Main category"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Badge variant="secondary">{category._count.products}</Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={category.isActive ? "active" : "destructive"}>
                    {category.isActive ? "ACTIVE" : "INACTIVE"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  {" "}
                  <CategoryActionMenu
                    categoryId={category.id}
                    categoryName={category.name}
                    isActive={category.isActive}
                  />{" "}
                </td>
              </tr>
            ))}
            {!categories.length && (
              <TableEmpty
                colSpan={5}
                title="No categories found"
                description="Create your first category to get started."
              />
            )}
          </DataTableBody>
        </DataTable>
        {/* Mobile */}
        <DataTableMobile>
          {categories.map((category) => (
            <MobileCard key={category.id}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 gap-3">
                  <div className="relative h-18 w-14 shrink-0 overflow-hidden rounded border bg-muted">
                    {category.imageUrl ? (
                      <Image
                        src={category.imageUrl}
                        alt={category.name}
                        fill
                        sizes="56px"
                        className="object-cover object-center"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                        N/A
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <Link
                      href={`/admin/categories/${category.id}/edit`}
                      className="line-clamp-1 font-semibold hover:underline"
                    >
                      {category.name}
                    </Link>
                    <p className="line-clamp-1 text-xs text-muted-foreground">
                      {category.slug}
                    </p>
                    <Badge
                      variant={category.isActive ? "active" : "destructive"}
                      className="mt-2 text-[10px]"
                    >
                      {category.isActive ? "ACTIVE" : "INACTIVE"}
                    </Badge>
                  </div>
                </div>

                <CategoryActionMenu
                  categoryId={category.id}
                  categoryName={category.name}
                  isActive={category.isActive}
                />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-muted/60 p-3">
                  <p className="text-xs text-muted-foreground"> Parent </p>
                  <p className="mt-1 line-clamp-1 font-medium">
                    {category.parent?.name || "Main category"}
                  </p>
                </div>
                <div className="rounded-xl bg-muted/60 p-3">
                  <p className="text-xs text-muted-foreground">Products</p>
                  <p className="mt-1 font-semibold">
                    {category._count.products}
                  </p>
                </div>
              </div>
            </MobileCard>
          ))}
          {!categories.length && (
            <MobileCard className="py-10 text-center">
              <p className="font-medium">No categories found</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Create your first category to get started.
              </p>
            </MobileCard>
          )}
        </DataTableMobile>
      </>
    </div>
  );
}
