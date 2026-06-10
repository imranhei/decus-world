import Image from "next/image";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getProductBySlug } from "@/server/queries/product-queries";

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

  return {
    title: product.metaTitle || product.name,
    description: product.metaDescription || product.shortDescription,
  };
}

export default async function ProductDetailsPage({
  params,
}: ProductDetailsPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const mainImage = product.images[0];
  const availableStock = product.variants.reduce((total, variant) => {
    return total + (variant.inventory?.quantity || 0);
  }, 0);

  return (
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

        <h1 className="mt-4 text-4xl font-bold">{product.name}</h1>

        <p className="mt-4 text-muted-foreground">{product.shortDescription}</p>

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
              {[...new Set(product.variants.map((v) => v.size).filter(Boolean))].map(
                (size) => (
                  <Badge key={size} variant="outline">
                    {size}
                  </Badge>
                )
              )}
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium">Available Colors</p>
            <div className="flex flex-wrap gap-2">
              {[...new Set(product.variants.map((v) => v.color).filter(Boolean))].map(
                (color) => (
                  <Badge key={color} variant="secondary">
                    {color}
                  </Badge>
                )
              )}
            </div>
          </div>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          Stock available: {availableStock}
        </p>

        <Button className="mt-8 w-full" size="lg">
          Add to Cart
        </Button>

        <div className="mt-10 border-t pt-8">
          <h2 className="font-semibold">Description</h2>
          <p className="mt-3 leading-7 text-muted-foreground">
            {product.description}
          </p>
        </div>
      </section>
    </main>
  );
}