'use client';

import { useState, useEffect } from 'react';
import { Cart, CartItem, Product } from '@/types';

export function useCart() {
  const [cart, setCart] = useState<Cart>({ items: [], total: 0 });

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const saveCart = (newCart: Cart) => {
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const addItem = (product: Product, quantity: number = 1) => {
    const existingItem = cart.items.find((item) => item.productId === product.id);

    let newItems: CartItem[];
    if (existingItem) {
      newItems = cart.items.map((item) =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      newItems = [...cart.items, { productId: product.id, quantity, product }];
    }

    const total = newItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    saveCart({ items: newItems, total });
  };

  const removeItem = (productId: string) => {
    const newItems = cart.items.filter((item) => item.productId !== productId);
    const total = newItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    saveCart({ items: newItems, total });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    const newItems = cart.items.map((item) =>
      item.productId === productId ? { ...item, quantity } : item
    );

    const total = newItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    saveCart({ items: newItems, total });
  };

  const clearCart = () => {
    saveCart({ items: [], total: 0 });
  };

  return { cart, addItem, removeItem, updateQuantity, clearCart };
}

