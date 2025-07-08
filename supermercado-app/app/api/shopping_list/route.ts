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