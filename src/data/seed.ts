import { db } from '@/lib/database';
import { Product } from '@/types';
import fs from 'fs/promises';
import path from 'path';

export async function seedDatabase() {
  try {
    const dataFile = path.join(process.cwd(), 'src', 'data', 'products.json');
    const raw = await fs.readFile(dataFile, 'utf-8');
    const productsData = JSON.parse(raw) as Product[];
    await db.seedProducts(productsData);
    console.log('Database seeded successfully (from file)');
    return true;
  } catch (error) {
    console.error('Error seeding database:', error);
    return false;
  }
}

