'use client';

import { useCartContext } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const { cart, updateQuantity, removeItem, clearCart } = useCartContext();

  if (cart.items.length === 0) {
    return (
      <div className="w-full px-4 py-8 lg:px-8 xl:px-12">
        <div className="mx-auto max-w-md text-center">
          <ShoppingBag size={64} className="mx-auto mb-4 text-gray-400" />
          <h1 className="mb-2 text-2xl font-bold text-gray-900">Your cart is empty</h1>
          <p className="mb-6 text-gray-600">
            Looks like you haven&apos;t added any items to your cart yet.
          </p>
          <Link href="/">
            <Button size="lg">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-8 lg:px-8 xl:px-12">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Shopping Cart</h1>
        <p className="text-gray-600">{cart.items.length} item(s) in your cart</p>
      </div>

      <div className="grid gap-8 xl:grid-cols-4 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="xl:col-span-3 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Cart Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.items.map((item) => (
                <div
                  key={item.productId}
                  className="flex gap-4 border-b pb-4 last:border-b-0"
                >
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-gray-100">
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
                      className="text-lg font-medium hover:text-blue-600"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-sm text-gray-500">{item.product.category}</p>
                    <p className="text-lg font-semibold text-blue-600">
                      {formatPrice(item.product.price)}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity - 1)
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-12 text-center font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity + 1)
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <p className="text-right font-semibold">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="mt-4 flex justify-between">
            <Link href="/">
              <Button variant="outline">Continue Shopping</Button>
            </Link>
            <Button variant="danger" onClick={clearCart}>
              Clear Cart
            </Button>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(cart.total)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>{formatPrice(cart.total * 0.1)}</span>
                </div>
                <hr />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(cart.total * 1.1)}</span>
                </div>
              </div>

              <Button className="w-full" size="lg">
                Proceed to Checkout
              </Button>

              <div className="text-center text-sm text-gray-500">
                <p>Secure checkout with SSL encryption</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
