# E-Commerce App - Next.js

A modern e-commerce application built with Next.js 16, TypeScript, and Tailwind CSS, demonstrating different rendering strategies.

## Features

- **Product Catalog**: Browse and search products with filtering options
- **Product Details**: Individual product pages with full information
- **Admin Panel**: Manage products (Create, Read, Update, Delete)
- **Inventory Dashboard**: Monitor stock levels and product statistics
- **Product Recommendations**: Server-side rendered recommendations
- **Authentication**: Basic login system with admin and user roles

## Rendering Strategies

- **Homepage (/)**: Static Site Generation (SSG)
- **Product Details (/products/[slug])**: Incremental Static Regeneration (ISR)
- **Dashboard (/dashboard)**: Server-Side Rendering (SSR)
- **Admin Panel (/admin)**: Client-Side Rendering (CSR)
- **Recommendations (/recommendations)**: Server Components

## Getting Started

Run the development server:

```bash
npm run dev
```

Open   to view the application.

## Demo Credentials

- **Admin**: admin@example.com / admin123
- **User**: user@example.com / user123

## Tech Stack

- Next.js 16
- TypeScript
- Tailwind CSS
- React Hooks
- Cloudinary (Image Management)

## Image Management with Cloudinary

This app uses Cloudinary for optimized image delivery and uploads.

### Quick Setup

1. Create a free account at [cloudinary.com](https://cloudinary.com)
2. Copy `.env.local.example` to `.env.local`
3. Add your Cloudinary credentials to `.env.local`
4. Restart the dev server

For detailed instructions, see [CLOUDINARY_SETUP.md](./CLOUDINARY_SETUP.md)

 
