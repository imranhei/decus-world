"use client";

import type { Banner } from "@prisma/client";
import { useState, useTransition } from "react";

import { RequiredLabel } from "@/components/shared/required-label";
import {
  SingleImageUpload,
  type SingleImageValue,
} from "@/components/shared/single-image-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createBannerAction,
  updateBannerAction,
} from "@/server/actions/admin-banner-actions";

type BannerFormProps = {
  banner?: Banner;
};

function formatDateInput(date?: Date | null) {
  if (!date) return "";
  return new Date(date).toISOString().slice(0, 10);
}

export function BannerForm({ banner }: BannerFormProps) {
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const [image, setImage] = useState<SingleImageValue | null>(
    banner?.imageUrl
      ? {
          url: banner.imageUrl,
          publicId: banner.imagePublicId || undefined,
        }
      : null,
  );

  function handleSubmit(formData: FormData) {
    setError("");

    if (!image) {
      setError("Banner image is required");
      return;
    }

    const values = {
      title: formData.get("title"),
      subtitle: formData.get("subtitle"),
      description: formData.get("description"),
      image,
      linkUrl: formData.get("linkUrl"),
      buttonText: formData.get("buttonText"),
      position: formData.get("position"),
      startsAt: formData.get("startsAt") || undefined,
      endsAt: formData.get("endsAt") || undefined,
      isActive: formData.get("isActive") === "on",
    };

    startTransition(async () => {
      const result = banner
        ? await updateBannerAction(banner.id, values)
        : await createBannerAction(values);

      if (result && !result.success) {
        setError(result.message);
      }
    });
  }

  return (
    <form
      action={handleSubmit}
      className="space-y-6 rounded-xl border bg-background p-6"
    >
      {error ? <p className="text-sm text-red-500">{error}</p> : null}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <RequiredLabel>Title</RequiredLabel>
          <Input name="title" defaultValue={banner?.title || ""} required />
        </div>

        <div className="space-y-2">
          <Label>Position</Label>
          <select
            name="position"
            defaultValue={banner?.position || "HOME_HERO"}
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          >
            <option value="HOME_HERO">Home Hero</option>
            <option value="HOME_SECTION">Home Section</option>
            <option value="PRODUCT_PAGE">Product Page</option>
            <option value="CATEGORY_PAGE">Category Page</option>
          </select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Subtitle</Label>
          <Input name="subtitle" defaultValue={banner?.subtitle || ""} />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Description</Label>
          <textarea
            name="description"
            defaultValue={banner?.description || ""}
            placeholder="Write a short promotional banner description..."
            className="min-h-24 w-full rounded-md border bg-background px-3 py-2 text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label>Link URL</Label>
          <Input
            name="linkUrl"
            defaultValue={banner?.linkUrl || ""}
            placeholder="/products"
          />
        </div>

        <div className="space-y-2">
          <Label>Button Text</Label>
          <Input
            name="buttonText"
            defaultValue={banner?.buttonText || ""}
            placeholder="Shop Now"
          />
        </div>

        <div className="space-y-2">
          <Label>Starts At</Label>
          <Input
            name="startsAt"
            type="date"
            defaultValue={formatDateInput(banner?.startsAt)}
          />
        </div>

        <div className="space-y-2">
          <Label>Ends At</Label>
          <Input
            name="endsAt"
            type="date"
            defaultValue={formatDateInput(banner?.endsAt)}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Banner Image</Label>
          <SingleImageUpload
            value={image}
            onChange={setImage}
            folder="decus-world/banners"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          name="isActive"
          type="checkbox"
          defaultChecked={banner?.isActive ?? true}
        />
        Active banner
      </label>

      <Button disabled={isPending} type="submit" className="h-10 rounded-full px-6 text-sm">
        {isPending ? "Saving..." : banner ? "Update Banner" : "Create Banner"}
      </Button>
    </form>
  );
}
