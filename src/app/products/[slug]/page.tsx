import { notFound } from 'next/navigation';
import { db } from '@/lib/database';
import { PRODUCT_REVALIDATION_TIME } from '@/lib/constants';
import { ProductDetailWrapper } from '../../../components/products/ProductDetailWrapper';

 
export const revalidate = PRODUCT_REVALIDATION_TIME;

export async function generateStaticParams() {
  const products = await db.getProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export default async function ProductDetailPage({ params }: { params: { slug?: string } | Promise<{ slug?: string }> }) {

  // Resolve params if Next provided a Promise-like shape
  let resolvedParams: { slug?: string; params?: { slug?: string } } | undefined = undefined;
  if (params && typeof (params as unknown as Promise<unknown>)?.then === 'function') {
    try {
      resolvedParams = (await (params as unknown as Promise<{ slug?: string; params?: { slug?: string } }>)) || undefined;
    } catch {
      resolvedParams = undefined;
    }
  } else {
    resolvedParams = params as { slug?: string; params?: { slug?: string } } | undefined;
  }

  // Try a few shapes for slug (direct or nested)
  const rawSlug = resolvedParams?.slug ?? resolvedParams?.params?.slug;

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

