"use client";

import Image from "next/image";
import { useEffect, useRef, useTransition } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { ImagePlus, Loader2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { deleteCloudinaryImageAction } from "@/server/actions/admin-product-actions";

export type ProductImageInput = {
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

type ProductImageManagerProps = {
  images: ProductImageInput[];
  onChange: (images: ProductImageInput[]) => void;
  isSaved?: boolean;
};

export function ProductImageManager({
  images,
  onChange,
  isSaved = false,
}: ProductImageManagerProps) {
  const [isPending, startTransition] = useTransition();

  const uploadedPublicIdsRef = useRef<Set<string>>(new Set());
  const savedRef = useRef(false);

  useEffect(() => {
  return () => {
    if (isSaved) return;

    uploadedPublicIdsRef.current.forEach((publicId) => {
      void deleteCloudinaryImageAction(publicId);
    });
  };
}, [isSaved]);

  function markAsSaved() {
    savedRef.current = true;
  }

  function handleRemoveImage(image: ProductImageInput) {
    startTransition(async () => {
      if (image.publicId) {
        await deleteCloudinaryImageAction(image.publicId);
        uploadedPublicIdsRef.current.delete(image.publicId);
      }

      onChange(
        images.filter(
          (item) =>
            !(item.url === image.url && item.publicId === image.publicId),
        ),
      );
    });
  }

  return (
    <div className="space-y-4">
      <input
        type="hidden"
        name="__imageSaveMarker"
        onChange={markAsSaved}
        readOnly
      />

      <CldUploadWidget
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
        options={{
          folder: "decus-world/products",
          multiple: true,
          maxFiles: 8,
          resourceType: "image",
        }}
        onSuccess={(result) => {
          const uploadResult = result as CloudinaryUploadResult;

          if (uploadResult.event !== "success") return;

          onChange([
            ...images,
            {
              url: uploadResult.info.secure_url,
              publicId: uploadResult.info.public_id,
            },
          ]);
        }}
      >
        {({ open }) => (
          <Button type="button" variant="outline" onClick={() => open()}>
            <ImagePlus className="mr-2 h-4 w-4" />
            Upload Images
          </Button>
        )}
      </CldUploadWidget>

      <input
        type="hidden"
        name="images"
        value={JSON.stringify(images)}
        readOnly
      />

      {images.length ? (
        <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-4">
          {images.map((image) => (
            <div
              key={`${image.publicId}-${image.url}`}
              className="relative aspect-square overflow-hidden rounded-xl border bg-muted"
            >
              <Image
                src={image.url}
                alt="Product image"
                fill
                // sizes="
                //         (max-width: 640px) 100vw,
                //         (max-width: 768px) 33vw,
                //         25vw
                //       "
                className="object-cover"
              />

              <button
                type="button"
                disabled={isPending}
                onClick={() => handleRemoveImage(image)}
                className="absolute right-2 top-2 rounded-full bg-black/70 p-1 text-white hover:bg-black disabled:opacity-50"
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <X className="h-4 w-4" />
                )}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
          No product images uploaded yet.
        </div>
      )}
    </div>
  );
}
