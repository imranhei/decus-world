"use client";

import Image from "next/image";
import { useTransition } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { ImagePlus, Loader2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { deleteCloudinaryImageAction } from "@/server/actions/admin-product-actions";

export type SingleImageValue = {
  url: string;
  publicId?: string;
};

type CloudinaryUploadResult = {
  event: "success";
  info: {
    secure_url: string;
    public_id: string;
  };
};

type SingleImageUploadProps = {
  value?: SingleImageValue | null;
  onChange: (value: SingleImageValue | null) => void;
  folder?: string;
};

export function SingleImageUpload({
  value,
  onChange,
  folder = "decus-world/common",
}: SingleImageUploadProps) {
  const [isPending, startTransition] = useTransition();

  function handleRemove() {
    startTransition(async () => {
      if (value?.publicId) {
        await deleteCloudinaryImageAction(value.publicId);
      }

      onChange(null);
    });
  }

  return (
    <div className="space-y-3">
      <CldUploadWidget
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
        options={{
          folder,
          multiple: false,
          maxFiles: 1,
          resourceType: "image",
        }}
        onSuccess={(result) => {
          const uploadResult = result as CloudinaryUploadResult;

          if (uploadResult.event !== "success") return;

          onChange({
            url: uploadResult.info.secure_url,
            publicId: uploadResult.info.public_id,
          });
        }}
      >
        {({ open }) => (
          <Button type="button" variant="outline" onClick={() => open()} className="h-10 rounded-full px-6 text-sm" disabled={isPending}>
            <ImagePlus className="mr-2 h-4 w-4" />
            Upload Image
          </Button>
        )}
      </CldUploadWidget>

      {value?.url ? (
        <div className="relative aspect-video max-w-sm overflow-hidden rounded-xl border bg-muted">
          <Image src={value.url} alt="Uploaded image" fill className="object-cover" />

          <button
            type="button"
            disabled={isPending}
            onClick={handleRemove}
            className="absolute right-2 top-2 rounded-full bg-black/70 p-1 text-white"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <X className="h-4 w-4" />
            )}
          </button>
        </div>
      ) : (
        <div className="max-w-sm rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
          No image uploaded.
        </div>
      )}
    </div>
  );
}