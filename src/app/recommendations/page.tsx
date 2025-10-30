import { db } from '@/lib/database';
import { ProductCard } from '@/components/products/ProductCard';

 
export default async function RecommendationsPage() {
  const products = await db.getProducts({ sortBy: 'rating' });
  const topProducts = products.slice(0, 6);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Recommended Products</h1>
        <p className="text-gray-600">Our top-rated products just for you</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {topProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="mt-12">
        <h2 className="mb-6 text-2xl font-bold">How We Recommend</h2>
        <div className="space-y-4 text-gray-700">
          <p>
            Our recommendation engine analyzes product ratings, customer reviews,
            and popularity to suggest the best items for you.
          </p>
          <p>
            These recommendations are generated on the server and updated with
            each page load to ensure you see the latest trending products.
          </p>
        </div>
      </div>
    </div>
  );
}

