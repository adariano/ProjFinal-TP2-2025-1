// app/api/market/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const data = await request.json()

  const { 
    name, 
    address, 
    distance, 
    rating, 
    phone, 
    hours, 
    googleMapsUrl, 
    priceLevel, 
    categories, 
    description 
  } = data

  if (!name || !address || !phone || !googleMapsUrl) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  try {
    const market = await prisma.market.create({
      data: {
        name,
        address,
        distance: distance || 0,
        rating: rating || 4.0,
        phone,
        hours,
        googleMapsUrl,
        priceLevel,
        categories,
        description,
      },
    })

    return NextResponse.json(market, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar mercado:', error)
    return NextResponse.json({ error: 'Erro ao criar mercado' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const markets = await prisma.market.findMany({
      orderBy: {
        name: 'asc'
      }
    })
    return NextResponse.json(markets, { status: 200 })
  } catch (error) {
    console.error('Erro ao listar mercados:', error)
    return NextResponse.json({ error: 'Erro ao listar mercados' }, { status: 500 })
  }
}
