 'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProducts } from '@/hooks/useProducts';
import { Product } from '@/types';
import { ProductForm } from '@/components/admin/ProductForm';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';

export default function AdminPage() {
  const router = useRouter();
  const { isAdmin, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      // Not authorized - redirect to home
      router.push('/');
    }
  }, [authLoading, isAdmin, router]);

  const { products, loading, refetch } = useProducts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();

  const handleCreateProduct = async (data: Partial<Product>) => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Create product failed:', errorData);
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
      console.log('Product created successfully:', result);
      
      setIsModalOpen(false);
      await refetch();
      
    } catch (error) {
      console.error('Failed to create product:', error);
      alert(`Failed to create product: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error; // Re-throw to let form know it failed
    }
  };

  const handleUpdateProduct = async (data: Partial<Product>) => {
    if (!editingProduct) return;

    try {
      const response = await fetch(`/api/products/${editingProduct.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsModalOpen(false);
        setEditingProduct(undefined);
        refetch();
      }
    } catch (error) {
      console.error('Failed to update product:', error);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`/api/admin/products?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        refetch();
      }
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-gray-600">Manage your products</p>
        </div>
        <Button
          onClick={() => {
            setEditingProduct(undefined);
            setIsModalOpen(true);
          }}
        >
          Add New Product
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card key={product.id}>
            <CardContent className="p-4">
              <h3 className="mb-2 text-lg font-semibold">{product.name}</h3>
              <p className="mb-2 text-sm text-gray-600">{product.category}</p>
              <p className="mb-2 font-bold text-blue-600">
                {formatPrice(product.price)}
              </p>
              <p className="text-sm">Stock: {product.stock}</p>
            </CardContent>
            <CardFooter className="flex gap-2 p-4 pt-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditingProduct(product);
                  setIsModalOpen(true);
                }}
              >
                Edit
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDeleteProduct(product.id)}
              >
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(undefined);
        }}
        title={editingProduct ? 'Edit Product' : 'Create Product'}
      >
        <ProductForm
          product={editingProduct}
          onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingProduct(undefined);
          }}
        />
      </Modal>
    </div>
  );
}

