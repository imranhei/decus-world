import { PrismaClient, Role, ProductStatus, DiscountType, BannerPosition } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  const hashedPassword = await bcrypt.hash("Admin@12345", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@example.com",
      password: hashedPassword,
      role: Role.ADMIN,
      phone: "01700000000",
      city: "Dhaka",
      address: "Dhaka, Bangladesh",
    },
  });

  const men = await prisma.category.upsert({
    where: { slug: "men" },
    update: {},
    create: {
      name: "Men",
      slug: "men",
      description: "Premium clothing for men.",
      imageUrl: "/images/categories/men.jpg",
    },
  });

  const women = await prisma.category.upsert({
    where: { slug: "women" },
    update: {},
    create: {
      name: "Women",
      slug: "women",
      description: "Stylish clothing for women.",
      imageUrl: "/images/categories/women.jpg",
    },
  });

  const tshirt = await prisma.category.upsert({
    where: { slug: "t-shirts" },
    update: {},
    create: {
      name: "T-Shirts",
      slug: "t-shirts",
      description: "Comfortable everyday t-shirts.",
      imageUrl: "/images/categories/t-shirts.jpg",
      parentId: men.id,
    },
  });

  const product1 = await prisma.product.upsert({
    where: { slug: "classic-black-t-shirt" },
    update: {},
    create: {
      name: "Classic Black T-Shirt",
      slug: "classic-black-t-shirt",
      description: "A premium cotton black t-shirt for everyday wear.",
      shortDescription: "Premium cotton black t-shirt.",
      status: ProductStatus.ACTIVE,
      price: 899,
      compareAtPrice: 1199,
      sku: "TSHIRT-BLACK-BASE",
      categoryId: tshirt.id,
      isFeatured: true,
      isNewArrival: true,
      metaTitle: "Classic Black T-Shirt",
      metaDescription: "Buy premium cotton black t-shirt for men.",
      images: {
        create: [
          {
            url: "/images/products/black-tshirt-1.jpg",
            altText: "Classic black t-shirt front view",
            position: 0,
          },
          {
            url: "/images/products/black-tshirt-2.jpg",
            altText: "Classic black t-shirt back view",
            position: 1,
          },
        ],
      },
      variants: {
        create: [
          {
            size: "M",
            color: "Black",
            sku: "TSHIRT-BLACK-M",
            inventory: {
              create: {
                quantity: 50,
                reserved: 0,
              },
            },
          },
          {
            size: "L",
            color: "Black",
            sku: "TSHIRT-BLACK-L",
            inventory: {
              create: {
                quantity: 40,
                reserved: 0,
              },
            },
          },
          {
            size: "XL",
            color: "Black",
            sku: "TSHIRT-BLACK-XL",
            inventory: {
              create: {
                quantity: 30,
                reserved: 0,
              },
            },
          },
        ],
      },
    },
  });

  const product2 = await prisma.product.upsert({
    where: { slug: "women-floral-summer-dress" },
    update: {},
    create: {
      name: "Women Floral Summer Dress",
      slug: "women-floral-summer-dress",
      description: "Lightweight floral dress for summer comfort and style.",
      shortDescription: "Lightweight floral summer dress.",
      status: ProductStatus.ACTIVE,
      price: 1899,
      compareAtPrice: 2499,
      sku: "DRESS-FLORAL-BASE",
      categoryId: women.id,
      isFeatured: true,
      isBestSeller: true,
      metaTitle: "Women Floral Summer Dress",
      metaDescription: "Shop stylish floral summer dress for women.",
      images: {
        create: [
          {
            url: "/images/products/floral-dress-1.jpg",
            altText: "Women floral summer dress",
            position: 0,
          },
        ],
      },
      variants: {
        create: [
          {
            size: "S",
            color: "Floral",
            sku: "DRESS-FLORAL-S",
            inventory: {
              create: {
                quantity: 25,
              },
            },
          },
          {
            size: "M",
            color: "Floral",
            sku: "DRESS-FLORAL-M",
            inventory: {
              create: {
                quantity: 35,
              },
            },
          },
        ],
      },
    },
  });

  await prisma.coupon.upsert({
    where: { code: "WELCOME10" },
    update: {},
    create: {
      code: "WELCOME10",
      description: "10% discount for new customers.",
      discountType: DiscountType.PERCENTAGE,
      discountValue: 10,
      minimumOrderAmount: 1000,
      maximumDiscountAmount: 500,
      usageLimit: 100,
      isActive: true,
    },
  });

  await prisma.coupon.upsert({
    where: { code: "SAVE200" },
    update: {},
    create: {
      code: "SAVE200",
      description: "Flat ৳200 discount.",
      discountType: DiscountType.FIXED,
      discountValue: 200,
      minimumOrderAmount: 2000,
      usageLimit: 50,
      isActive: true,
    },
  });

  await prisma.banner.createMany({
    data: [
      {
        title: "New Season Collection",
        subtitle: "Upgrade your wardrobe with premium fashion.",
        imageUrl: "/images/banners/home-hero.jpg",
        linkUrl: "/products",
        buttonText: "Shop Now",
        position: BannerPosition.HOME_HERO,
        isActive: true,
      },
      {
        title: "Best Deals",
        subtitle: "Limited time offers on selected products.",
        imageUrl: "/images/banners/deals.jpg",
        linkUrl: "/products?sort=discount",
        buttonText: "Explore Deals",
        position: BannerPosition.HOME_SECTION,
        isActive: true,
      },
    ],
    skipDuplicates: true,
  });

  console.log("Seed completed.");
  console.log("Admin email: admin@example.com");
  console.log("Admin password: Admin@12345");
  console.log({ adminId: admin.id, product1: product1.name, product2: product2.name });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });