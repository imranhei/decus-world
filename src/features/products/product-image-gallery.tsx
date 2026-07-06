"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProductImage } from "@prisma/client";

import { getCloudinaryImageUrl } from "@/lib/cloudinary-image";

type ProductImageGalleryProps = {
  images: ProductImage[];
  productName: string;
  isNewArrival?: boolean;
};

export function ProductImageGallery({
  images,
  productName,
  isNewArrival,
}: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectedImage = images[selectedIndex];

  return (
    <>
      <div className="relative overflow-hidden bg-muted">
        {isNewArrival && (
          <div className="absolute left-0 top-0 z-10 bg-red-500 px-4 py-1.5 text-sm font-bold text-white">
            New
          </div>
        )}

        <div className="relative aspect-4/5 w-full">
          {selectedImage ? (
            <Image
              src={getCloudinaryImageUrl(selectedImage.url, 900, 1100)}
              alt={selectedImage.altText || productName}
              fill
              priority
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              No image
            </div>
          )}
        </div>
      </div>

      {images.length > 1 && (
        <div className="mt-5 grid grid-cols-4 gap-3 sm:grid-cols-5">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className={`relative aspect-square overflow-hidden rounded-lg border transition-all ${
                selectedIndex === index
                  ? "border-2 border-primary ring-2 ring-primary/20"
                  : "border-border hover:border-primary/40"
              }`}
            >
              <Image
                src={getCloudinaryImageUrl(image.url, 200, 200)}
                alt={image.altText || productName}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </>
  );
}