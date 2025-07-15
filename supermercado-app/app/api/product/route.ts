import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Handler para GET /api/product
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        items: {
          include: {
            shoppingList: true,
          },
        },
      },
    });
    
    // Transform the data to match the expected frontend format
    const transformedProducts = products.map(product => ({
      id: product.id,
      name: product.name,
      category: product.category,
      brand: product.brand,
      avgPrice: product.avgPrice,
      lastUpdate: product.lastUpdate.toISOString(),
    }));
    
    return NextResponse.json(transformedProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Handler para POST /api/product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, category, brand, avgPrice } = body;
    
    // Create the product
    const newProduct = await prisma.product.create({
      data: {
        name,
        category,
        brand,
        avgPrice: avgPrice || 0,
        lastUpdate: new Date(),
      },
    });
    
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}