import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma' 

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  }

  try {
    const market = await prisma.market.findUnique({ where: { id } })

    if (!market) {
      return NextResponse.json({ error: 'Market not found' }, { status: 404 })
    }

    return NextResponse.json(market)
  } catch (error) {
    console.error('Erro ao buscar mercado:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
