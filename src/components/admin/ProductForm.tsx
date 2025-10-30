'use client';

import { useState } from 'react';
import { Product } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CloudinaryUploadWidget } from '@/components/ui/CloudinaryUploadWidget';
import { CATEGORIES } from '@/lib/constants';

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: Partial<Product>) => void;
  onCancel: () => void;
}

export function ProductForm({ product, onSubmit, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || 0,
    category: product?.category || '',
    imageUrl: product?.imageUrl || '',
    rating: product?.rating ?? 0,
    stock: product?.stock || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
      style={{ height: '90vh', overflowY: 'auto' }}
    >
      <div>
        <label className="mb-2 block text-sm font-medium">Product Name</label>
        <Input
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Description</label>
        <textarea
          required
          className="w-full rounded-md border border-gray-300 px-3 py-2"
          rows={4}
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">Price</label>
          <Input
            type="number"
            step="0.01"
            required
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: parseFloat(e.target.value) })
            }
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">Rating</label>
          <Input
            type="number"
            step="0.1"
            min={0}
            max={5}
            value={formData.rating}
            onChange={(e) =>
              setFormData({ ...formData, rating: parseFloat(e.target.value) || 0 })
            }
          />
          <p className="mt-1 text-xs text-gray-500">Enter rating between 0 and 5 (optional)</p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Stock</label>
          <Input
            type="number"
            required
            value={formData.stock}
            onChange={(e) =>
              setFormData({ ...formData, stock: parseInt(e.target.value) })
            }
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Category</label>
        <select
          required
          className="w-full rounded-md border border-gray-300 px-3 py-2"
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
        >
          <option value="">Select a category</option>
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Image</label>
        <div className="space-y-2">
          <Input
            value={formData.imageUrl}
            onChange={(e) =>
              setFormData({ ...formData, imageUrl: e.target.value })
            }
            placeholder="Or paste image URL"
          />
          {!formData.imageUrl ? (
            <CloudinaryUploadWidget
              onUploadSuccess={(uploadedUrl) => {
                // uploadedUrl is guaranteed to be a string (secure_url)
                setFormData({ ...formData, imageUrl: uploadedUrl });
              }}
            />
          ) : (
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setFormData({ ...formData, imageUrl: '' })}
              >
                Change Image
              </Button>
              <span className="text-sm text-gray-600">Image uploaded</span>
            </div>
          )}
          {formData.imageUrl && (
            <div className="mt-2">
              <img
                src={formData.imageUrl}
                alt="Preview"
                className="h-32 w-32 rounded-md object-cover"
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit" className="flex-1">
          {product ? 'Update' : 'Create'} Product
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

