import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { seedDatabase } from '@/data/seed';
let isInitialized = false;
async function ensureInitialized() {
  if (!isInitialized) {
    await seedDatabase();
    isInitialized = true;
  }
}

export async function POST(request: NextRequest) {
  await ensureInitialized();
  try {
    const body = await request.json();

    const required = ['name', 'description', 'price', 'category', 'imageUrl', 'stock'];
    for (const key of required) {
      if (body[key] === undefined || body[key] === null || body[key] === '') {
        return NextResponse.json({ success: false, error: `Missing field: ${key}` }, { status: 400 });
      }
    }

    const product = await db.createProduct({
      name: String(body.name),
      description: String(body.description),
      price: Number(body.price),
      category: String(body.category),
      imageUrl: String(body.imageUrl),
      stock: Number(body.stock),
      rating: body.rating ? Number(body.rating) : undefined,
      reviews: body.reviews ? Number(body.reviews) : undefined,
    });

    return NextResponse.json({ success: true, data: product, message: 'Product created successfully' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create product' }, { status: 500 });
  }
}

 
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Product ID is required',
        },
        { status: 400 }
      );
    }

    const success = await db.deleteProduct(id);

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Product not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete product',
      },
      { status: 500 }
    );
  }
}

