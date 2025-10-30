'use client';

import { ShoppingCart } from 'lucide-react';
import { useCartContext } from '@/contexts/CartContext';

interface CartIconProps {
  onClick: () => void;
}

export function CartIcon({ onClick }: CartIconProps) {
  const { itemCount } = useCartContext();

  return (
    <button
      onClick={onClick}
      className="relative flex items-center justify-center p-2 text-gray-700 transition-colors hover:text-blue-600"
    >
      <ShoppingCart size={24} />
      {itemCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </button>
  );
}
