import type {
  Category,
  Product,
  ProductImage,
  ProductVariant,
  Inventory,
  Review,
  User,
} from "@prisma/client";

import { siteConfig } from "@/config/site";

type ProductSeoInput = Product & {
  category: Category;
  images: ProductImage[];
  variants: Array<ProductVariant & { inventory: Inventory | null }>;
  reviews: Array<
    Review & {
      user: Pick<User, "name" | "image">;
    }
  >;
};

export function createProductJsonLd(product: ProductSeoInput) {
  const productUrl = `${siteConfig.url}/products/${product.slug}`;
  const images = product.images.map((image) => image.url);

  const stock = product.variants.reduce((total, variant) => {
    return total + (variant.inventory?.quantity || 0);
  }, 0);

  const ratingCount = product.reviews.length;
  const ratingValue =
    ratingCount > 0
      ? product.reviews.reduce((total, review) => total + review.rating, 0) /
        ratingCount
      : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.metaDescription || product.shortDescription || product.description,
    image: images,
    sku: product.sku || product.id,
    brand: {
      "@type": "Brand",
      name: siteConfig.name,
    },
    category: product.category.name,
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "BDT",
      price: Number(product.price),
      availability:
        stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
    ...(ratingValue
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: Number(ratingValue.toFixed(1)),
            reviewCount: ratingCount,
          },
        }
      : {}),
  };
}

export function createBreadcrumbJsonLd(
  items: Array<{
    name: string;
    url: string;
  }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function createCollectionJsonLd({
  name,
  description,
  url,
}: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url,
  };
}