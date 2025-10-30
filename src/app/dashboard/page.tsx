import { db } from '@/lib/database';
import { DashboardStatsComponent } from '@/components/admin/DashboardStats';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LOW_STOCK_THRESHOLD } from '@/lib/constants';
import { formatPrice } from '@/lib/utils';
 
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const products = await db.getProducts();
  const lowStockProducts = await db.getLowStockProducts(LOW_STOCK_THRESHOLD);
  const categories = await db.getCategories();

  const stats = {
    totalProducts: products.length,
    lowStockProducts: lowStockProducts.length,
    totalCategories: categories.length,
    totalValue: products.reduce((sum, p) => sum + p.price * p.stock, 0),
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Inventory Dashboard</h1>
        <p className="text-gray-600">Monitor your product inventory</p>
      </div>

      <div className="space-y-8">
        <DashboardStatsComponent stats={stats} />

        {lowStockProducts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Low Stock Alert</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lowStockProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-yellow-600">
                        {product.stock} units left
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatPrice(product.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>All Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{product.stock} in stock</p>
                    <p className="text-sm text-gray-600">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

