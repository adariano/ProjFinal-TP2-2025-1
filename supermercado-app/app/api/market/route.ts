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
    const marketData: any = {
      name,
      address,
      distance: distance || 0,
      rating: rating || 4.0,
    }

    if (phone) marketData.phone = phone
    if (hours) marketData.hours = hours
    if (googleMapsUrl) marketData.googleMapsUrl = googleMapsUrl
    if (priceLevel) marketData.priceLevel = priceLevel
    if (categories) marketData.categories = categories
    if (description) marketData.description = description

    const market = await prisma.market.create({
      data: marketData,
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

export async function PUT(request: Request) {
  const data = await request.json()

  const { 
    id,
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

  if (!id || !name || !address) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  try {
    const marketData: any = {
      name,
      address,
      distance: distance || 0,
      rating: rating || 4.0,
    }

    if (phone) marketData.phone = phone
    if (hours) marketData.hours = hours
    if (googleMapsUrl) marketData.googleMapsUrl = googleMapsUrl
    if (priceLevel) marketData.priceLevel = priceLevel
    if (categories) marketData.categories = categories
    if (description) marketData.description = description

    const market = await prisma.market.update({
      where: { id: Number(id) },
      data: marketData,
    })

    return NextResponse.json(market, { status: 200 })
  } catch (error) {
    console.error('Erro ao atualizar mercado:', error)
    return NextResponse.json({ error: 'Erro ao atualizar mercado' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'ID do mercado é obrigatório' }, { status: 400 })
  }

  try {
    await prisma.market.delete({
      where: { id: Number(id) }
    })

    return NextResponse.json({ message: 'Mercado excluído com sucesso' }, { status: 200 })
  } catch (error) {
    console.error('Erro ao excluir mercado:', error)
    return NextResponse.json({ error: 'Erro ao excluir mercado' }, { status: 500 })
  }
}
