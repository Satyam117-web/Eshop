import { notFound } from 'next/navigation';
import { db } from '@/lib/database';
import { ProductDetailWrapper } from '../../../components/products/ProductDetailWrapper';

 
// Next.js requires page-level revalidate to be a static literal. Use a literal here.
export const revalidate = 3600; // 1 hour

export async function generateStaticParams() {
  const products = await db.getProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export default async function ProductDetailPage(props: unknown) {
  // Resolve possible Promise-shaped params safely at runtime
  const rawParams = await Promise.resolve((props as unknown as { params?: unknown })?.params);
  const paramsTyped = rawParams as { slug?: string } | undefined;

  const rawSlug = paramsTyped?.slug;

  if (!rawSlug) {
    // No slug available — show debug list in dev or 404 in prod
    const all = await db.getProducts();
    if (process.env.NODE_ENV !== 'production') {
      console.error(`Product not found for slug: ${rawSlug}. Available slugs: ${all.map((p) => p.slug).join(', ')}`);
      return (
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold">Product not found: {String(rawSlug)}</h1>
          <p className="mt-2 text-sm text-gray-600">Available slugs (debug):</p>
          <ul className="mt-2 list-disc pl-6">
            {all.map((p) => (
              <li key={p.id} className="text-sm text-gray-800">{p.slug} — {p.name}</li>
            ))}
          </ul>
        </div>
      );
    }

    notFound();
  }

  const slug = String(rawSlug);
  const product = await db.getProductBySlug(slug);
  if (!product) {
    
    const all = await db.getProducts();
    const normalized = decodeURIComponent(String(slug)).toLowerCase().trim();
    const alt = all.find((p) => String(p.slug).toLowerCase().trim() === normalized);

    if (alt) {
      return <ProductDetailWrapper product={alt} />;
    }

    
    if (process.env.NODE_ENV !== 'production') {
      console.error(`Product not found for slug: ${slug}. Available slugs: ${all.map((p) => p.slug).join(', ')}`);
      return (
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold">Product not found: {slug}</h1>
          <p className="mt-2 text-sm text-gray-600">Available slugs (debug):</p>
          <ul className="mt-2 list-disc pl-6">
            {all.map((p) => (
              <li key={p.id} className="text-sm text-gray-800">{p.slug} — {p.name}</li>
            ))}
          </ul>
        </div>
      );
    }

    notFound();
  }

  return <ProductDetailWrapper product={product} />;
}

