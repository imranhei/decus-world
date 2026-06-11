import { notFound } from "next/navigation";

import { BannerForm } from "@/features/admin/banners/banner-form";
import { getAdminBannerById } from "@/server/queries/admin-banner-queries";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditBannerPage({ params }: PageProps) {
  const { id } = await params;
  const banner = await getAdminBannerById(id);

  if (!banner) {
    notFound();
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit Banner</h1>
        <p className="mt-1 text-muted-foreground">
          Update banner content, image, position, and schedule.
        </p>
      </div>

      <BannerForm banner={banner} />
    </div>
  );
}