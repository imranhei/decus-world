import Image from "next/image";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { getProductBySlug } from "@/server/queries/product-queries";

import { AddToCartButton } from "@/features/cart/add-to-cart-button";
import { auth } from "../../../../../auth";

import { WishlistButton } from "@/features/wishlist/wishlist-button";
import { isProductWishlisted } from "@/server/queries/wishlist-queries";

import { StarRating } from "@/components/shared/star-rating";

import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/config/site";
import { ReviewForm } from "@/features/reviews/review-form";
import { createBreadcrumbJsonLd, createProductJsonLd } from "@/lib/seo";

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

  const averageRating =
    product.reviews.length > 0
      ? product.reviews.reduce((total, review) => total + review.rating, 0) /
        product.reviews.length
      : 0;

  const isWishlisted = await isProductWishlisted(product.id);
  const mainImage = product.images[0];
  const availableStock = product.variants.reduce((total, variant) => {
    return total + (variant.inventory?.quantity || 0);
  }, 0);

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
      <main className="mx-auto grid max-w-7xl gap-10 px-4 py-10 lg:grid-cols-2">
        <section>
          <div className="relative aspect-3/4 overflow-hidden rounded-3xl bg-muted">
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

          {product.images.length > 1 ? (
            <div className="mt-4 grid grid-cols-4 gap-3">
              {product.images.slice(1).map((image) => (
                <div
                  key={image.id}
                  className="relative aspect-square overflow-hidden rounded-xl bg-muted"
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

        <section>
          <Badge>{product.category.name}</Badge>

          <div className="mt-3 flex items-center gap-2">
            <StarRating rating={Math.round(averageRating)} />
            <span className="text-sm text-muted-foreground">
              {product.reviews.length
                ? `${averageRating.toFixed(1)} (${product.reviews.length} reviews)`
                : "No reviews yet"}
            </span>
          </div>

          <h1 className="mt-4 text-4xl font-bold">{product.name}</h1>

          <p className="mt-4 text-muted-foreground">
            {product.shortDescription}
          </p>

          <div className="mt-6 flex items-center gap-3">
            <p className="text-3xl font-bold">৳{Number(product.price)}</p>

            {product.compareAtPrice ? (
              <p className="text-lg text-muted-foreground line-through">
                ৳{Number(product.compareAtPrice)}
              </p>
            ) : null}
          </div>

          <div className="mt-8 space-y-4">
            <div>
              <p className="mb-2 text-sm font-medium">Available Sizes</p>
              <div className="flex flex-wrap gap-2">
                {[
                  ...new Set(
                    product.variants.map((v) => v.size).filter(Boolean),
                  ),
                ].map((size) => (
                  <Badge key={size} variant="outline">
                    {size}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium">Available Colors</p>
              <div className="flex flex-wrap gap-2">
                {[
                  ...new Set(
                    product.variants.map((v) => v.color).filter(Boolean),
                  ),
                ].map((color) => (
                  <Badge key={color} variant="secondary">
                    {color}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            Stock available: {availableStock}
          </p>

          <div className="mt-8 flex gap-3">
            <div className="flex-1">
              <AddToCartButton
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
                    inventory: variant.inventory,
                  })),
                }}
              />
            </div>

            <WishlistButton
              productId={product.id}
              isLoggedIn={Boolean(session?.user)}
              initialWishlisted={isWishlisted}
              variant="full"
            />
          </div>

          <div className="mt-10 border-t pt-8">
            <h2 className="font-semibold">Description</h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              {product.description}
            </p>
          </div>
        </section>

        <section className="lg:col-span-2 border-t pt-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
            <div>
              <h2 className="text-2xl font-bold">Customer Reviews</h2>

              <div className="mt-6 space-y-4">
                {product.reviews.map((review) => (
                  <div key={review.id} className="rounded-xl border p-5">
                    <div className="flex items-center justify-between gap-3">
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
                      <p className="mt-4 text-sm text-muted-foreground">
                        {review.comment}
                      </p>
                    ) : null}
                  </div>
                ))}

                {!product.reviews.length ? (
                  <p className="text-sm text-muted-foreground">
                    No approved reviews yet.
                  </p>
                ) : null}
              </div>
            </div>

            {session?.user ? (
              <ReviewForm productId={product.id} />
            ) : (
              <div className="rounded-xl border p-5">
                <h3 className="font-semibold">Write a Review</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Please login to submit a review.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
