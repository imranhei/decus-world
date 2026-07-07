"use client";

import type { Banner } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { getCloudinaryImageUrl } from "@/lib/cloudinary-image";


type HomeHeroSliderProps = {
  banners: Banner[];
};

export function HomeHeroSlider({ banners }: HomeHeroSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [banners.length]);

  const previousSlide = () => {
    setActiveIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % banners.length);
  };

  if (!banners.length) {
    return null;
  }

  const banner = banners[activeIndex];

  return (
    <section className="relative overflow-hidden bg-zinc-950 text-white">
      <AnimatePresence mode="wait">
        <motion.div
          key={banner.id}
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -80 }}
          transition={{
            duration: 0.7,
            ease: "easeInOut",
          }}
        >
          <div className="mx-auto grid min-h-162 max-w-7xl items-center gap-12 px-4 py-20 lg:grid-cols-2">
            {/* Left Content */}
            <div>
              <motion.p
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="text-sm font-medium font-mono! uppercase tracking-[0.3em] text-zinc-400"
              >
                {banner.title}
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 35 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="mt-4 sm:text-5xl text-4xl font-bold tracking-tight lg:text-7xl"
              >
                {banner.subtitle}
              </motion.h1>

              {banner.description && (
                <motion.p
                  initial={{ opacity: 0, y: 35 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-6 max-w-xl text-lg text-zinc-300"
                >
                  {banner.description}
                </motion.p>
              )}

              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-8 flex flex-wrap gap-3"
              >
                <Button size="lg" className="rounded-full px-6 h-10">
                  <Link href={banner.linkUrl || "/products"}>
                    {banner.buttonText || "Shop Now"}
                  </Link>
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-white/30 bg-white/10 px-6 text-white hover:bg-white hover:text-black h-10"
                >
                  <Link href="/products?newArrival=true">New Arrivals</Link>
                </Button>
              </motion.div>
            </div>

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, scale: 1.12 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 1.2,
                ease: "easeOut",
              }}
              className="relative overflow-hidden rounded-3xl bg-white/10"
            >
              <motion.div
                animate={{
                  scale: [1, 1.08],
                }}
                transition={{
                  duration: 5,
                  ease: "linear",
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className="relative h-75 sm:h-95 md:h-112 lg:h-130 xl:h-150"
              >
                <Image
                  src={getCloudinaryImageUrl(banner.imageUrl, 600)}
                  alt={banner.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      {banners.length > 1 && (
        <>
          <button
            type="button"
            onClick={previousSlide}
            className="absolute left-5 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20 md:flex"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={nextSlide}
            className="absolute right-5 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20 md:flex"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-3">
            {banners.map((item, index) => (
              <button
                key={item.id}
                onClick={() => setActiveIndex(index)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  activeIndex === index
                    ? "w-8 bg-white"
                    : "w-2.5 bg-white/40 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
