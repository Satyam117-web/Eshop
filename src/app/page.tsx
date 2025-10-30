import { db } from '@/lib/database';
import { seedDatabase } from '@/data/seed';
import { ProductList } from '@/components/products/ProductList';
import Hero from '@/components/ui/Hero';
import { searchProducts } from '@/lib/utils';

export default async function Home({
  searchParams,
}: {
  searchParams?: { search?: string } | Promise<{ search?: string }>;
}) {
   
  await seedDatabase();
  const products = await db.getProducts();
  
  const resolvedParams = await Promise.resolve(searchParams);
  const searchQuery = resolvedParams?.search?.trim() || '';
  const filteredProducts = searchQuery
    ? searchProducts(products, searchQuery)
    : products;

  return (
    <div className="w-full">
      {!searchQuery && <Hero />}
      <div className="px-4 py-6 sm:py-8 lg:px-8 xl:px-12">
        {searchQuery && (
          <div className="mb-6">
            <h1 className="text-2xl font-semibold mb-2">
              Search results for &quot;{searchQuery}&quot;
            </h1>
            <p className="text-gray-600">
              Found {filteredProducts.length} product{filteredProducts.length === 1 ? '' : 's'}
            </p>
          </div>
        )}
        <ProductList products={filteredProducts} />
      </div>
    </div>
  );
}

