import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { seedDatabase } from '@/data/seed';
import { ProductFilters } from '@/types';

// Initialize database on first request
let isInitialized = false;

async function ensureInitialized() {
  if (!isInitialized) {
    await seedDatabase();
    isInitialized = true;
  }
}

export async function GET(request: NextRequest) {
  await ensureInitialized();

  try {
    const searchParams = request.nextUrl.searchParams;
    const filters: ProductFilters = {
      category: searchParams.get('category') || undefined,
      minPrice: searchParams.get('minPrice')
        ? parseFloat(searchParams.get('minPrice')!)
        : undefined,
      maxPrice: searchParams.get('maxPrice')
        ? parseFloat(searchParams.get('maxPrice')!)
        : undefined,
      search: searchParams.get('search') || undefined,
      sortBy: (searchParams.get('sortBy') as ProductFilters['sortBy']) || undefined,
    };

    const products = await db.getProducts(filters);

    return NextResponse.json({
      success: true,
      data: products,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch products',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  await ensureInitialized();

  try {
    const body = await request.json();
    const product = await db.createProduct(body);

    return NextResponse.json(
      {
        success: true,
        data: product,
        message: 'Product created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create product',
      },
      { status: 500 }
    );
  }
}

