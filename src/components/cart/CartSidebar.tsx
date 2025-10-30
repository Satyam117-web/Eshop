'use client';

import { X, Plus, Minus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartContext } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { cart, removeItem, updateQuantity, clearCart } = useCartContext();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-white bg-opacity-90 transition-opacity"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 z-50 h-full w-full max-w-sm sm:max-w-md bg-white shadow-xl">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b p-4">
            <h2 className="text-lg font-semibold">Shopping Cart</h2>
            <button
              onClick={onClose}
              className="rounded-full p-1 hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {cart.items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-gray-500">
                <ShoppingCart size={64} className="mb-4" />
                <p className="text-lg">Your cart is empty</p>
                <p className="text-sm">Add some products to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div key={item.productId} className="flex gap-2 sm:gap-3 border-b pb-4">
                    <div className="relative h-12 w-12 sm:h-16 sm:w-16 shrink-0 overflow-hidden rounded-md bg-gray-100">
                      <Image
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <Link
                        href={`/products/${item.product.slug}`}
                        onClick={onClose}
                        className="text-xs sm:text-sm font-medium hover:text-blue-600 line-clamp-2"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-xs text-gray-500">{item.product.category}</p>
                      <p className="text-xs sm:text-sm font-semibold text-blue-600">
                        {formatPrice(item.product.price)}
                      </p>
                      
                      <div className="mt-1 sm:mt-2 flex items-center gap-1 sm:gap-2">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300"
                        >
                          <Minus size={10} className="sm:hidden" />
                          <Minus size={12} className="hidden sm:block" />
                        </button>
                        <span className="w-6 sm:w-8 text-center text-xs sm:text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300"
                        >
                          <Plus size={10} className="sm:hidden" />
                          <Plus size={12} className="hidden sm:block" />
                        </button>
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cart.items.length > 0 && (
            <div className="border-t p-4">
              <div className="mb-4 flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span>{formatPrice(cart.total)}</span>
              </div>
              
              <div className="space-y-2">
                <Link href="/cart" onClick={onClose}>
                  <Button className="w-full">View Cart & Checkout</Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={clearCart}
                  className="w-full"
                >
                  Clear Cart
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function ShoppingCart({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="m1 1 4 4 2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}
