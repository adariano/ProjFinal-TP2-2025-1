import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

// POST - criar nova lista de compras
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, userId } = body;

    if (!name || !userId) {
      return NextResponse.json(
        { error: "name e userId faltando" },
        { status: 400 }
      );
    }

    const shoppingList = await prisma.shoppingList.create({
      data: {
        name,
        userId,
      },
      include: {
        items: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(shoppingList, { status: 201 });
  } catch (error) {
    console.error("Falha ao criar lista de compras:", error);
    return NextResponse.json(
      { error: "Falha ao criar lista de compras" },
      { status: 500 }
    );
  }
}

// GET - pega todas as listas de compras ou filtra por userId
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    const where = userId ? { userId: parseInt(userId) } : {};

    const shoppingLists = await prisma.shoppingList.findMany({
      where,
      include: {
        items: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(shoppingLists);
  } catch (error) {
    console.error("Falha ao buscar listas de compras:", error);
    return NextResponse.json(
      { error: "Falha ao buscar listas de compras" },
      { status: 500 }
    );
  }
}