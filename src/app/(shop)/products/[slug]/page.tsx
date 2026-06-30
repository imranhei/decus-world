import SizeChart from "@/assets/size-chart.png";
import { Heart, Ruler } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/seo/json-ld";
import { ImagePreviewDialog } from "@/components/shared/image-preview-dialog";
import { StarRating } from "@/components/shared/star-rating";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { ProductPurchasePanel } from "@/features/products/product-purchase-panel";
import { ReviewForm } from "@/features/reviews/review-form";
import { WishlistButton } from "@/features/wishlist/wishlist-button";
import { createBreadcrumbJsonLd, createProductJsonLd } from "@/lib/seo";
import { getProductBySlug } from "@/server/queries/product-queries";
import { isProductWishlisted } from "@/server/queries/wishlist-queries";
import { auth } from "../../../../../auth";

type ProductDetailsPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: ProductDetailsPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product not found",
    };
  }

  const image = product.images[0]?.url;

  return {
    title: product.metaTitle || product.name,
    description:
      product.metaDescription ||
      product.shortDescription ||
      product.description.slice(0, 160),
    alternates: {
      canonical: `/products/${product.slug}`,
    },
    openGraph: {
      title: product.metaTitle || product.name,
      description:
        product.metaDescription ||
        product.shortDescription ||
        product.description.slice(0, 160),
      url: `${siteConfig.url}/products/${product.slug}`,
      type: "website",
      images: image ? [{ url: image }] : [],
    },
  };
}

export default async function ProductDetailsPage({
  params,
}: ProductDetailsPageProps) {
  const session = await auth();
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const isWishlisted = await isProductWishlisted(product.id);
  const mainImage = product.images[0];

  const sizes = [
    ...new Set(product.variants.map((variant) => variant.size).filter(Boolean)),
  ];

  const colors = [
    ...new Set(
      product.variants.map((variant) => variant.color).filter(Boolean),
    ),
  ];

  const averageRating =
    product.reviews.length > 0
      ? product.reviews.reduce((total, review) => total + review.rating, 0) /
        product.reviews.length
      : 0;

  const productJsonLd = createProductJsonLd(product);
  const breadcrumbJsonLd = createBreadcrumbJsonLd([
    {
      name: "Home",
      url: siteConfig.url,
    },
    {
      name: "Products",
      url: `${siteConfig.url}/products`,
    },
    {
      name: product.category.name,
      url: `${siteConfig.url}/products?category=${product.category.slug}`,
    },
    {
      name: product.name,
      url: `${siteConfig.url}/products/${product.slug}`,
    },
  ]);

  return (
    <>
      <JsonLd data={productJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      <main className="mx-auto max-w-7xl px-4 py-8">
        <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-foreground">
            Products
          </Link>
          <span>/</span>
          <Link
            href={`/products?category=${product.category.slug}`}
            className="hover:text-foreground"
          >
            {product.category.name}
          </Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        <section className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <section>
            <div className="relative overflow-hidden bg-muted">
              {product.isNewArrival ? (
                <div className="absolute left-0 top-0 z-10 bg-red-500 px-4 py-1.5 text-sm font-bold text-white">
                  New
                </div>
              ) : null}

              <div className="relative aspect-4/5 w-full">
                {mainImage ? (
                  <Image
                    src={mainImage.url}
                    alt={mainImage.altText || product.name}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    No image
                  </div>
                )}
              </div>
            </div>

            {product.images.length > 1 ? (
              <div className="mt-5 grid grid-cols-4 gap-3 sm:grid-cols-5">
                {product.images.map((image, index) => (
                  <div
                    key={image.id}
                    className={`relative aspect-square overflow-hidden border bg-muted ${
                      index === 0 ? "border-2 border-black" : "border-border"
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt={image.altText || product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : null}
          </section>

          <section className="lg:sticky lg:top-24 lg:h-fit">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              {product.name}
            </h1>

            <div className="mt-4 flex items-center gap-3">
              <p className="text-2xl font-medium">
                Tk {Number(product.price).toLocaleString("en-US")}
              </p>

              {product.compareAtPrice ? (
                <p className="text-lg text-muted-foreground line-through">
                  Tk {Number(product.compareAtPrice).toLocaleString("en-US")}
                </p>
              ) : null}

              {/* <span className="text-lg">+ VAT</span> */}
            </div>

            <p className="mt-2 text-sm text-muted-foreground">
              <span className="underline">Shipping</span> calculated at
              checkout.
            </p>

            <div className="mt-3 flex items-center gap-2">
              <StarRating rating={Math.round(averageRating)} />
              <span className="text-sm text-muted-foreground">
                {product.reviews.length
                  ? `${averageRating.toFixed(1)} (${product.reviews.length} reviews)`
                  : "No reviews yet"}
              </span>
            </div>

            <ImagePreviewDialog
              image={SizeChart}
              title="Size Chart"
              alt="Size chart"
              buttonText="Size Chart"
              icon={<Ruler className="mr-2 h-4 w-4" />}
              buttonClassName="mt-6 h-12 w-48 rounded-none border-black"
            />

            <div className="mt-6">
              <WishlistButton
                productId={product.id}
                isLoggedIn={Boolean(session?.user)}
                initialWishlisted={isWishlisted}
                variant="full"
              />
            </div>

            <ProductPurchasePanel
              isLoggedIn={Boolean(session?.user)}
              product={{
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: Number(product.price),
                imageUrl: product.images[0]?.url,
                variants: product.variants.map((variant) => ({
                  id: variant.id,
                  size: variant.size,
                  color: variant.color,
                  inventory: variant.inventory
                    ? {
                        quantity: variant.inventory.quantity,
                        reserved: variant.inventory.reserved,
                      }
                    : null,
                })),
              }}
            />

            <div className="mt-8 space-y-5 leading-7 text-muted-foreground">
              <p>{product.description}</p>

              <p>
                <strong className="text-foreground">Material:</strong> 100%
                Cotton Fabric.
              </p>

              <p>
                <strong className="text-foreground">Fit:</strong> Slim Fit
              </p>

              <div>
                <p className="text-foreground">Care Instruction:</p>
                <ul className="mt-1 space-y-1">
                  <li>✓ Wash dark colors separately</li>
                  <li>✓ Do not bleach</li>
                  <li>✓ Wash mild detergent</li>
                  <li>✓ Cold water soft wash</li>
                  <li>✓ Wash & Warm iron inside out</li>
                  <li>✓ Do not tumble dry</li>
                  <li>✓ Do not iron directly on print</li>
                </ul>
              </div>

              {product.sku ? <p>{product.sku}</p> : null}

              <p className="font-semibold text-red-600">
                Product color may slightly vary due to various monitor settings
                & photographic lighting sources.
              </p>
            </div>
          </section>
        </section>

        <section className="mt-16 border">
          <div className="flex border-b">
            <button className="border-b-2 border-black px-6 py-4 font-semibold">
              Customer Reviews ({product.reviews.length})
            </button>
            <button className="px-6 py-4 font-semibold text-muted-foreground">
              Shipping & Returns
            </button>
          </div>

          <div className="grid gap-8 p-8 lg:grid-cols-[1fr_320px]">
            <div>
              <h2 className="text-2xl font-bold">Customer Reviews</h2>

              <div className="mt-5 flex items-center gap-3">
                <StarRating rating={Math.round(averageRating)} />
                <p className="text-muted-foreground">
                  {product.reviews.length
                    ? `${averageRating.toFixed(1)} out of 5`
                    : "Be the first to write a review"}
                </p>
              </div>

              <div className="mt-6 space-y-4">
                {product.reviews.map((review) => (
                  <div key={review.id} className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          {review.user.name || "Customer"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <StarRating rating={review.rating} />
                    </div>

                    {review.comment ? (
                      <p className="mt-3 text-sm text-muted-foreground">
                        {review.comment}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>

            {session?.user ? (
              <ReviewForm productId={product.id} />
            ) : (
              <Button className="w-full bg-orange-600 hover:bg-orange-700">
                <Link href="/login">Write a review</Link>
              </Button>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
