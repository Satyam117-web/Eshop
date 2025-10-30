'use client';

import { useState } from 'react';
import { ProductFilters } from '@/types';
import { CATEGORIES } from '@/lib/constants';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ProductFilterProps {
  onFilterChange: (filters: ProductFilters) => void;
}

export function ProductFilter({ onFilterChange }: ProductFilterProps) {
  const [filters, setFilters] = useState<ProductFilters>({});

  const handleFilterChange = (key: keyof ProductFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    onFilterChange({});
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold">Filters</h3>

      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium">Search</label>
          <Input
            type="text"
            placeholder="Search products..."
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Category</label>
          <select
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            value={filters.category || ''}
            onChange={(e) =>
              handleFilterChange('category', e.target.value || undefined)
            }
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Sort By</label>
          <select
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            value={filters.sortBy || ''}
            onChange={(e) =>
              handleFilterChange('sortBy', e.target.value || undefined)
            }
          >
            <option value="">Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Name</option>
            <option value="rating">Rating</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Price Range</label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={filters.minPrice || ''}
              onChange={(e) =>
                handleFilterChange(
                  'minPrice',
                  e.target.value ? parseFloat(e.target.value) : undefined
                )
              }
            />
            <Input
              type="number"
              placeholder="Max"
              value={filters.maxPrice || ''}
              onChange={(e) =>
                handleFilterChange(
                  'maxPrice',
                  e.target.value ? parseFloat(e.target.value) : undefined
                )
              }
            />
          </div>
        </div>

        <Button variant="outline" onClick={clearFilters} className="w-full">
          Clear Filters
        </Button>
      </div>
    </div>
  );
}

