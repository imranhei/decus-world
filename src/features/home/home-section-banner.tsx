import Image from "next/image";
import Link from "next/link";
import type { Banner } from "@prisma/client";

import { Button } from "@/components/ui/button";

type HomeSectionBannerProps = {
  banner?: Banner | null;
};

export function HomeSectionBanner({ banner }: HomeSectionBannerProps) {
  if (!banner) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid overflow-hidden rounded-3xl border bg-muted lg:grid-cols-2">
        <div className="relative min-h-80 lg:min-h-105">
          <Image
            src={banner.imageUrl}
            alt={banner.title}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex flex-col justify-center p-8 md:p-12">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-muted-foreground">
            {banner.title}
          </p>

          {banner.subtitle ? (
            <h2 className="mt-4 font-heading text-4xl font-semibold md:text-5xl">
              {banner.subtitle}
            </h2>
          ) : null}

          {banner.description ? (
            <p className="mt-5 max-w-xl leading-7 text-muted-foreground">
              {banner.description}
            </p>
          ) : null}

          <Button className="mt-8 w-fit h-10 text-sm rounded-full px-6">
            <Link href={banner.linkUrl || "/products"}>
              {banner.buttonText || "Explore Collection"}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}