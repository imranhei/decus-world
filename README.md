# Decus World

A modern, production-ready clothing eCommerce platform built with Next.js, TypeScript, PostgreSQL, Prisma, Auth.js, Tailwind CSS, and shadcn/ui.

Designed for scalability, performance, SEO, and maintainability, Decus World provides a complete online shopping experience for customers and a powerful admin dashboard for store management.

---

## Features

### Customer Features

* User registration and login
* Secure authentication with Auth.js
* Role-based access control
* Customer profile management
* Product browsing and search
* Category filtering
* Product sorting
* Wishlist management
* Shopping cart
* Guest cart support
* Cart synchronization after login
* Cash on Delivery checkout
* Order history
* Product reviews and ratings
* Coupon and discount support
* Responsive mobile-first design

### Guest Features

* Browse products
* Search and filter products
* Add items to cart
* Wishlist redirect to login
* Checkout after authentication

### Admin Features

* Dashboard analytics
* Sales overview
* Order management
* Customer management
* User role management
* Product management
* Category management
* Inventory management
* Coupon management
* Banner management
* Review moderation
* Low stock monitoring
* Order status updates

---

## Tech Stack

### Frontend

* Next.js App Router
* TypeScript
* Tailwind CSS
* shadcn/ui
* TanStack Query
* Zustand
* React Hook Form
* Zod

### Backend

* Next.js Route Handlers
* Server Actions
* PostgreSQL
* Prisma ORM
* Auth.js

### Storage & Services

* Cloudinary
* Resend
* Neon PostgreSQL

### SEO

* Metadata API
* Open Graph
* Twitter Cards
* JSON-LD Structured Data
* Sitemap.xml
* Robots.txt

---

## Authentication

The application uses Auth.js with Credentials Provider.

Features include:

* Secure password hashing using bcrypt
* Session-based authentication
* HttpOnly cookies
* Role-based authorization
* Protected admin routes
* Protected customer account routes

Supported roles:

* ADMIN
* STAFF
* CUSTOMER
* GUEST

---

## Product Management

Products support:

* Multiple images
* Cloudinary image upload
* Categories
* Variants
* Sizes
* Colors
* Inventory tracking
* Featured products
* New arrivals
* Best sellers
* SEO metadata

---

## Cart System

The cart system supports:

### Guest Cart

* Stored locally with Zustand
* Works without authentication

### Customer Cart

* Stored in PostgreSQL
* Persistent across devices

### Cart Sync

When a guest logs in:

* Guest cart automatically merges with database cart
* Existing quantities are preserved
* Duplicate items are combined

---

## Order Management

Supported workflow:

Customer Order

```text
Cart
 → Checkout
 → Cash on Delivery
 → Order Created
 → Confirmation Email
```

Admin Workflow

```text
Pending
 → Processing
 → Shipped
 → Delivered
```

Additional statuses:

* Cancelled
* Returned

---

## Coupon System

Supports:

* Percentage discounts
* Fixed discounts
* Minimum order amount
* Maximum discount amount
* Usage limits
* Active/Inactive status
* Expiration dates

---

## Review System

Customers can:

* Submit product reviews
* Submit ratings
* View approved reviews

Admins can:

* Approve reviews
* Reject reviews
* Moderate content

---

## Banner Management

Supports:

* Cloudinary image uploads
* Active/Inactive banners
* Homepage hero banners
* Promotional banners
* Scheduled banners
* CTA buttons
* Multiple positions

---

## Email Notifications

Powered by Resend.

Supported emails:

* Order confirmation
* New order notification to admin

Email notifications can be disabled using:

```env
EMAIL_NOTIFICATIONS_ENABLED=false
```

---

## Project Structure

```text
src
├── app
├── components
├── config
├── emails
├── features
├── hooks
├── lib
├── server
│   ├── actions
│   ├── queries
│   └── services
├── store
├── types
└── utils
```

---

## Environment Variables

```env
DATABASE_URL=

AUTH_SECRET=
AUTH_TRUST_HOST=true

NEXT_PUBLIC_APP_URL=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

RESEND_API_KEY=
RESEND_FROM_EMAIL=
ADMIN_ORDER_EMAIL=

EMAIL_NOTIFICATIONS_ENABLED=true
```

---

## Performance Optimizations

* Server Components
* Route-level data fetching
* Server Actions
* Prisma query optimization
* Image optimization
* Dynamic imports where necessary
* Reusable UI components
* Pagination
* SEO-first architecture

---

## Security

* HttpOnly cookies
* Password hashing
* Role-based access control
* Protected admin actions
* Server-side validation
* Zod schema validation
* Secure database queries
* CSRF protection through Auth.js

---

## Deployment

Recommended stack:

* Vercel
* Neon PostgreSQL
* Cloudinary
* Resend

---

## Future Roadmap

* Stripe Payments
* SSLCommerz
* bKash
* Nagad
* Multi-vendor support
* Product recommendations
* Advanced analytics
* Inventory forecasting
* Multi-language support
* Multi-currency support
* PWA support

---

## License

Private Project — Decus World.

All rights reserved.
