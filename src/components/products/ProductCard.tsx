"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCartContext } from '@/contexts/CartContext';
import { Check, ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartContext();
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const handleAddToCart = async () => {
    if (product.stock === 0 || isAdding) return;
    
    setIsAdding(true);
    addItem(product, 1);
    
    // Show success feedback
    setJustAdded(true);
    setTimeout(() => {
      setIsAdding(false);
      setTimeout(() => setJustAdded(false), 2000);
    }, 300);
  };

  return (
    <div className="h-full">
      <Link href={`/products/${product.slug}`} className="block h-full">
        <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:ring-2 hover:ring-blue-500/20">
          <div 
            className="relative h-48 w-full overflow-hidden bg-gray-100"
          >
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 "
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {product.stock <= 10 && product.stock > 0 && (
              <span className="absolute right-2 top-2 rounded bg-yellow-500 px-2 py-1 text-xs font-semibold text-white">
                Low Stock
              </span>
            )}
            {product.stock === 0 && (
              <span className="absolute right-2 top-2 rounded bg-red-500 px-2 py-1 text-xs font-semibold text-white">
                Out of Stock
              </span>
            )}
          </div>
          <CardContent className="p-4">
            <h3 
              className="mb-1 text-lg font-semibold hover:text-blue-600"
            >
              {product.name}
            </h3>
        <p className="mb-2 text-sm text-gray-600">{product.category}</p>
        <p className="text-xl font-bold text-blue-600">
          {formatPrice(product.price)}
        </p>
        {product.rating && (
          <div className="mt-2 flex items-center gap-1">
            <span className="text-yellow-500">★</span>
            <span className="text-sm font-medium">{product.rating}</span>
            {product.reviews && (
              <span className="text-sm text-gray-500">({product.reviews})</span>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="w-full">
          <Button 
            className="w-full transition-all duration-200 hover:bg-blue-700" 
            disabled={product.stock === 0 || isAdding}
            onClick={(e) => { e.stopPropagation(); handleAddToCart(); }}
          >
          {isAdding ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Adding...
            </div>
          ) : justAdded ? (
            <div className="flex items-center gap-2">
              <Check size={16} />
              Added!
            </div>
            
          ) : product.stock === 0 ? (
            'Out of Stock'
          ) : (
            <div className="flex items-center gap-2">
              <ShoppingCart size={16} />
              Add to Cart
            </div>
          )}
          </Button>
        </div>
      </CardFooter>
        </Card>
      </Link>
    </div>
  );
}

