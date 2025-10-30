import { Product, ProductFilters } from '@/types';
import { generateId, generateSlug } from './utils';
import fs from 'fs/promises';
import path from 'path';

// File-backed database (writes to src/data/products.json)
class Database {
  private products: Product[] = [];
  private dataFile = path.join(process.cwd(), 'src', 'data', 'products.json');

  private initialized = false;

  private async ensureLoaded() {
    if (this.initialized) return;
    try {
      const raw = await fs.readFile(this.dataFile, 'utf-8');
      const parsed = JSON.parse(raw) as Product[];
      this.products = parsed || [];
    } catch {
      // If file doesn't exist or can't be read, start with empty array
      console.warn('Could not load products file, starting with empty products array.');
      this.products = [];
    }
    this.initialized = true;
  }

  private async saveToFile() {
    try {
      await fs.writeFile(this.dataFile, JSON.stringify(this.products, null, 2), 'utf-8');
    } catch (error) {
      console.error('Failed to write products file:', error);
    }
  }

  async getProducts(filters?: ProductFilters): Promise<Product[]> {
    await this.ensureLoaded();
    let filtered = [...this.products];

    if (filters?.category) {
      filtered = filtered.filter((p) => p.category === filters.category);
    }

    if (filters?.minPrice !== undefined) {
      filtered = filtered.filter((p) => p.price >= filters.minPrice!);
    }

    if (filters?.maxPrice !== undefined) {
      filtered = filtered.filter((p) => p.price <= filters.maxPrice!);
    }

    if (filters?.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(search) ||
          p.description.toLowerCase().includes(search)
      );
    }

    if (filters?.sortBy) {
      switch (filters.sortBy) {
        case 'price-asc':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'name':
          filtered.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'rating':
          filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          break;
      }
    }

    return filtered;
  }

  async getProductBySlug(slug: string): Promise<Product | null> {
    await this.ensureLoaded();
    if (!slug) return null;
    const normalized = decodeURIComponent(String(slug)).toLowerCase().trim();
    return (
      this.products.find((p) => String(p.slug).toLowerCase().trim() === normalized) || null
    );
  }

  async getProductById(id: string): Promise<Product | null> {
    await this.ensureLoaded();
    return this.products.find((p) => p.id === id) || null;
  }

  async createProduct(
    data: Omit<Product, 'id' | 'slug' | 'createdAt' | 'updatedAt'>
  ): Promise<Product> {
    await this.ensureLoaded();
    const product: Product = {
      ...data,
      id: generateId(),
      slug: generateSlug(data.name),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.products.push(product);
    await this.saveToFile();
    return product;
  }

  async updateProduct(
    id: string,
    data: Partial<Omit<Product, 'id' | 'createdAt'>>
  ): Promise<Product | null> {
    await this.ensureLoaded();
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) return null;

    this.products[index] = {
      ...this.products[index],
      ...data,
      slug: data.name ? generateSlug(data.name) : this.products[index].slug,
      updatedAt: new Date().toISOString(),
    };

    await this.saveToFile();
    return this.products[index];
  }

  async deleteProduct(id: string): Promise<boolean> {
    await this.ensureLoaded();
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) return false;

    this.products.splice(index, 1);
    await this.saveToFile();
    return true;
  }

  async seedProducts(products: Product[]): Promise<void> {
    this.products = products;
    // ensure file exists and reflects seeded data
    await this.saveToFile();
  }

  async getCategories(): Promise<string[]> {
    await this.ensureLoaded();
    return [...new Set(this.products.map((p) => p.category))];
  }

  async getLowStockProducts(threshold: number = 10): Promise<Product[]> {
    await this.ensureLoaded();
    return this.products.filter((p) => p.stock <= threshold);
  }
}

export const db = new Database();

