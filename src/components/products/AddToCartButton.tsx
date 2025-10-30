'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { useCartContext } from '@/contexts/CartContext';
import { Check, ShoppingCart, Plus, Minus } from 'lucide-react';

interface AddToCartButtonProps {
  product: Product;
  size?: 'sm' | 'md' | 'lg';
  showQuantity?: boolean;
}

export function AddToCartButton({ 
  product, 
  size = 'lg', 
  showQuantity = true 
}: AddToCartButtonProps) {
  const { addItem, cart, updateQuantity } = useCartContext();
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Check if product is already in cart
  const cartItem = cart.items.find(item => item.productId === product.id);
  const currentQuantity = cartItem?.quantity || 0;

  const handleAddToCart = async () => {
    if (product.stock === 0 || isAdding) return;
    
    setIsAdding(true);
    addItem(product, quantity);
    
    // Show success feedback
    setJustAdded(true);
    setTimeout(() => {
      setIsAdding(false);
      setTimeout(() => setJustAdded(false), 2000);
    }, 300);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    if (newQuantity > product.stock) return;
    setQuantity(newQuantity);
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {showQuantity && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <span className="text-sm sm:text-base font-medium">Quantity:</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
              className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Minus size={12} className="sm:hidden" />
              <Minus size={14} className="hidden sm:block" />
            </button>
            <span className="w-12 sm:w-16 text-center font-medium text-base sm:text-lg">
              {quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= product.stock}
              className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={12} className="sm:hidden" />
              <Plus size={14} className="hidden sm:block" />
            </button>
          </div>
        </div>
      )}

      {currentQuantity > 0 && (
        <div className="rounded-lg bg-blue-50 p-2 sm:p-3 text-xs sm:text-sm text-blue-700">
          <p>✓ {currentQuantity} item(s) already in cart</p>
        </div>
      )}

      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button 
          size={size}
          className="w-full transition-all duration-200 hover:bg-blue-700 text-sm sm:text-base" 
          disabled={product.stock === 0 || isAdding}
          onClick={handleAddToCart}
        >
          {isAdding ? (
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 sm:h-4 sm:w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span className="hidden sm:inline">Adding to Cart...</span>
              <span className="sm:hidden">Adding...</span>
            </div>
          ) : justAdded ? (
            <div className="flex items-center gap-2">
              <Check size={16} className="sm:hidden" />
              <Check size={20} className="hidden sm:block" />
              <span className="hidden sm:inline">Added to Cart!</span>
              <span className="sm:hidden">Added!</span>
            </div>
          ) : product.stock === 0 ? (
            'Out of Stock'
          ) : (
            <div className="flex items-center gap-2">
              <ShoppingCart size={16} className="sm:hidden" />
              <ShoppingCart size={20} className="hidden sm:block" />
              <span className="hidden sm:inline">Add {quantity > 1 ? `${quantity} ` : ''}to Cart</span>
              <span className="sm:hidden">Add {quantity > 1 ? `${quantity} ` : ''}to Cart</span>
            </div>
          )}
        </Button>
      </motion.div>
    </div>
  );
}
