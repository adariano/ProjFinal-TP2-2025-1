// app/api/market/route.ts
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  const data = await request.json()

  const { name, address, distance, rating } = data

  if (!name || !address || distance === undefined || rating === undefined) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  try {
    const market = await prisma.market.create({
      data: {
        name,
        address,
        distance,
        rating,
      },
    })

    return NextResponse.json(market, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar mercado:', error)
    return NextResponse.json({ error: 'Erro ao criar mercado' }, { status: 500 })
  }
}
