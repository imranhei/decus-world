import Image from "next/image";
import Link from "next/link";
import { MdHideImage, MdVisibility } from "react-icons/md";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toggleBannerStatusAction } from "@/server/actions/admin-banner-actions";
import { getAdminBanners } from "@/server/queries/admin-banner-queries";
import { Edit, ImagePlus } from "lucide-react";

export default async function AdminBannersPage() {
  const banners = await getAdminBanners();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Banners</h1>
          <p className="mt-1 text-muted-foreground">
            Manage homepage and promotional banners.
          </p>
        </div>

        <Button className="h-10 rounded-full px-6 text-sm flex items-center gap-2">
          <ImagePlus />
          <Link href="/admin/banners/new">Add Banner</Link>
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border bg-background">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted">
            <tr>
              <th className="px-4 py-3 text-left">Banner</th>
              <th className="px-4 py-3 text-left">Position</th>
              <th className="px-4 py-3 text-left">Schedule</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {banners.map((banner) => (
              <tr key={banner.id} className="border-b last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-14 w-24 overflow-hidden rounded bg-muted">
                      <Image
                        src={banner.imageUrl}
                        alt={banner.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div>
                      <p className="font-medium">{banner.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {banner.subtitle || "No subtitle"}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-3">{banner.position}</td>

                <td className="px-4 py-3 text-xs text-muted-foreground">
                  <p>
                    Start:{" "}
                    {banner.startsAt
                      ? new Date(banner.startsAt).toLocaleDateString()
                      : "Anytime"}
                  </p>
                  <p>
                    End:{" "}
                    {banner.endsAt
                      ? new Date(banner.endsAt).toLocaleDateString()
                      : "No end"}
                  </p>
                </td>

                <td className="px-4 py-3">
                  <Badge variant={banner.isActive ? "default" : "secondary"}>
                    {banner.isActive ? "ACTIVE" : "INACTIVE"}
                  </Badge>
                </td>

                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="outline" className="text-teal-500">
                      <Link href={`/admin/banners/${banner.id}/edit`}>
                        <Edit />
                      </Link>
                    </Button>

                    <form
                      action={async () => {
                        "use server";
                        await toggleBannerStatusAction(banner.id);
                      }}
                    >
                      <Button size="sm" variant="outline" type="submit">
                        {banner.isActive ? <MdHideImage className="text-red-500 size-4" /> : <MdVisibility className="text-blue-500 size-4"/>}
                      </Button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}

            {!banners.length ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-muted-foreground"
                >
                  No banners found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
