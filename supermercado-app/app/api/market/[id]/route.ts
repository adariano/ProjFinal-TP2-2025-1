import { NextResponse } from 'next/server'

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
// app/api/market/[id]/route.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  const data = await request.json()

  try {
    const updated = await prisma.market.update({
      where: { id },
      data,
    })
    return NextResponse.json(updated, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Market not found or invalid data' }, { status: 404 })
  }
}
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id)

  try {
    await prisma.market.delete({
      where: { id },
    })
    return new Response(null, { status: 204 }) // No Content
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao deletar o mercado' }, { status: 404 })
  }
}