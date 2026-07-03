"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";

export function FeaturedProductSliderShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const CARD_WIDTH = 320;

  function scrollLeft() {
    sliderRef.current?.scrollBy({
      left: -CARD_WIDTH,
      behavior: "smooth",
    });
  }

  function scrollRight() {
    const slider = sliderRef.current;
    if (!slider) return;

    const maxScrollLeft = slider.scrollWidth - slider.clientWidth;

    if (slider.scrollLeft >= maxScrollLeft - 10) {
      slider.scrollTo({
        left: 0,
        behavior: "smooth",
      });
      return;
    }

    slider.scrollBy({
      left: CARD_WIDTH,
      behavior: "smooth",
    });
  }

  useEffect(() => {
    if (isHovered) return;

    const timer = setInterval(() => {
      scrollRight();
    }, 6000); // Slower (6 seconds)

    return () => clearInterval(timer);
  }, [isHovered]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Button
        type="button"
        variant="secondary"
        size="icon"
        onClick={scrollLeft}
        className="absolute left-2 top-1/2 z-20 h-10 w-10 -translate-y-1/2 rounded-full border bg-background/90 shadow-lg backdrop-blur transition hover:scale-105"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>

      <Button
        type="button"
        variant="secondary"
        size="icon"
        onClick={scrollRight}
        className="absolute right-2 top-1/2 z-20 h-10 w-10 -translate-y-1/2 rounded-full border bg-background/90 shadow-lg backdrop-blur transition hover:scale-105"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>

      {/* Slider */}
      <div
        ref={sliderRef}
        className="flex gap-4 overflow-x-auto scroll-smooth pb-4 scrollbar-none [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>
    </div>
  );
}

export function FeaturedProductSlide({
  children,
  index,
}: {
  children: React.ReactNode;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.45,
        delay: index * 0.06,
        ease: "easeOut",
      }}
      className="min-w-[calc(50%-8px)] sm:min-w-65 lg:min-w-70 py-4"
    >
      {children}
    </motion.div>
  );
}
