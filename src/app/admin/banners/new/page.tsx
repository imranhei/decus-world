import { BannerForm } from "@/features/admin/banners/banner-form";

export default function NewBannerPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create Banner</h1>
        <p className="mt-1 text-muted-foreground">
          Add banner image, content, position, and schedule.
        </p>
      </div>

      <BannerForm />
    </div>
  );
}