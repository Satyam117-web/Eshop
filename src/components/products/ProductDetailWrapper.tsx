 'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { AddToCartButton } from './AddToCartButton';
import { useCartContext } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface ProductDetailWrapperProps {
  product: Product;
}

export function ProductDetailWrapper({ product }: ProductDetailWrapperProps) {
  const selectedImage = product.imageUrl;
  return (
    <div className="w-full px-4 py-6 sm:py-8 lg:px-8 xl:px-12">
      <motion.div 
        className="mx-auto max-w-6xl grid gap-6 sm:gap-8 lg:grid-cols-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Left column: Large image with thumbnails below (original layout preserved) */}
        <motion.div 
          className="flex flex-col"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={selectedImage}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          {/* Thumbnails removed per request */}
        </motion.div>

        {/* Right column: Details (unchanged style) */}
        <motion.div 
          className="flex flex-col"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="mb-4 sm:mb-6">
            <motion.h1 
              className="mb-2 text-2xl sm:text-3xl lg:text-4xl font-bold"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {product.name}
            </motion.h1>
            <p className="text-sm sm:text-base text-gray-600">{product.category}</p>
          </div>

          {product.rating && (
            <div className="mb-4 sm:mb-6 flex items-center gap-2">
              <span className="text-lg sm:text-xl text-yellow-500">★</span>
              <span className="text-base sm:text-lg font-medium">{product.rating}</span>
              {product.reviews && (
                <span className="text-sm sm:text-base text-gray-500">({product.reviews} reviews)</span>
              )}
            </div>
          )}

          <div className="mb-4 sm:mb-6">
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600">
              {formatPrice(product.price)}
            </p>
          </div>

          <div className="mb-6 sm:mb-8">
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{product.description}</p>
          </div>

          <div className="mb-6 sm:mb-8">
            <p className="text-sm sm:text-base">
              <span className="font-medium">Stock:</span>{' '}
              <span className={product.stock <= 10 ? 'text-yellow-600' : 'text-green-600'}>
                {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
              </span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <AddToCartButton product={product} size="lg" showQuantity={true} />
            </div>
            <div>
              <BuyNow product={product} />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function BuyNow({ product }: { product: Product }) {
  const { addItem } = useCartContext();
  const router = useRouter();

  const handleBuyNow = () => {
    if (product.stock === 0) return;
    addItem(product, 1);
    // Navigate to cart/checkout
    router.push('/cart');
  };

  return (
    <div className="flex h-full items-end">
      <Button size="lg" className="w-full bg-amber-500 text-white hover:bg-amber-600 focus:ring-amber-500" onClick={handleBuyNow}>
        Buy Now
      </Button>
    </div>
  );
}
