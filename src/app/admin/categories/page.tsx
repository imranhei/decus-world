import Image from "next/image";
import Link from "next/link";

import { getAdminCategories } from "@/server/queries/admin-category-queries";
import { toggleCategoryStatusAction } from "@/server/actions/admin-category-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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

      <div className="overflow-hidden rounded-xl border bg-background">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted">
            <tr>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">Parent</th>
              <th className="px-4 py-3 text-left">Products</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="border-b last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 overflow-hidden rounded bg-muted">
                      {category.imageUrl ? (
                        <Image
                          src={category.imageUrl}
                          alt={category.name}
                          fill
                          className="object-cover"
                        />
                      ) : null}
                    </div>

                    <div>
                      <p className="font-medium">{category.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {category.slug}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-3">
                  {category.parent?.name || "Main category"}
                </td>

                <td className="px-4 py-3">{category._count.products}</td>

                <td className="px-4 py-3">
                  <Badge variant={category.isActive ? "default" : "secondary"}>
                    {category.isActive ? "ACTIVE" : "INACTIVE"}
                  </Badge>
                </td>

                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="outline">
                      <Link href={`/admin/categories/${category.id}/edit`}>
                        Edit
                      </Link>
                    </Button>

                    <form
                      action={async () => {
                        "use server";
                        await toggleCategoryStatusAction(category.id);
                      }}
                    >
                      <Button size="sm" variant="secondary">
                        {category.isActive ? "Disable" : "Enable"}
                      </Button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}

            {!categories.length ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-muted-foreground"
                >
                  No categories found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}