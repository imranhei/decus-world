import {
  Clock,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Shirt,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Our Story",
  description:
    "Discover Decus World, a premium fashion destination in Mirpur DOHS, Dhaka.",
};

const features = [
  {
    title: "Premium Quality",
    description: "Carefully selected fabrics and refined finishing.",
    icon: ShieldCheck,
  },
  {
    title: "Modern Style",
    description: "Clean, elegant, and timeless clothing for daily wear.",
    icon: Shirt,
  },
  {
    title: "Perfect Fit",
    description: "Designed for comfort, confidence, and everyday movement.",
    icon: Sparkles,
  },
  {
    title: "Visit Anytime",
    description: "Our store is open and ready to welcome you.",
    icon: Clock,
  },
];

export default function OurStoryPage() {
  return (
    <main>
      <section className="bg-zinc-950 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 lg:grid-cols-[1fr_0.85fr] lg:py-24">
          <div className="flex flex-col justify-center">
            <p className="text-sm font-medium uppercase tracking-[0.35em] text-zinc-400">
              Decus World
            </p>

            <h1 className="mt-5 max-w-3xl font-heading text-5xl font-semibold leading-tight md:text-7xl">
              Premium fashion, refined for everyday confidence.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
              Decus World is a modern clothing destination built for people who
              value quality, timeless style, and a polished shopping experience.
              Our collection focuses on clean design, comfortable fits, and
              premium everyday fashion.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" className="rounded-none">
                <Link href="/products">Shop Collection</Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="rounded-none border-white bg-transparent text-white hover:bg-white hover:text-black"
              >
                <Link href="#visit-store">Visit Store</Link>
              </Button>
            </div>
          </div>

          <div className="relative min-h-105 overflow-hidden border border-white/10 bg-zinc-900">
            <Image
              src="/images/store-open-2.jpeg"
              alt="Decus World store interior"
              fill
              priority
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative min-h-130 overflow-hidden bg-muted">
            <Image
              src="/images/store-open-1.jpeg"
              alt="Decus World grand opening"
              fill
              className="object-cover"
            />
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-muted-foreground">
              Now Open
            </p>

            <h2 className="mt-4 font-heading text-4xl font-semibold md:text-6xl">
              Discover premium quality redefined for you.
            </h2>

            <p className="mt-6 leading-8 text-muted-foreground">
              Our store was created to offer a refined fashion experience where
              every detail matters — from fabric selection to fit, from store
              ambience to customer service. Whether you are looking for smart
              formal shirts, timeless essentials, or modern casual wear, Decus
              World brings quality and style together.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {features.map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.title} className="border p-5">
                    <Icon className="h-6 w-6" />
                    <h3 className="mt-4 font-semibold">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="visit-store" className="bg-muted/50">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-muted-foreground">
              Contact Us
            </p>

            <h2 className="mt-4 font-heading text-4xl font-semibold md:text-5xl">
              Visit Decus World
            </h2>

            <p className="mt-4 text-muted-foreground">
              We are open. Visit our store and experience fashion beyond trends.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <div className="border bg-background p-6">
              <MapPin className="h-6 w-6" />
              <h3 className="mt-4 font-semibold">Address</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Avenue-3, Road-10, House-717
                <br />
                Mirpur DOHS, Dhaka-1216
              </p>
            </div>

            <div className="border bg-background p-6">
              <Phone className="h-6 w-6" />
              <h3 className="mt-4 font-semibold">Phone</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                +8801828013253
              </p>
            </div>

            <div className="border bg-background p-6">
              <Mail className="h-6 w-6" />
              <h3 className="mt-4 font-semibold">Email</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                info@decusworld.com
              </p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Button size="lg" className="rounded-none">
              <Link href="/products">Explore Products</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
