import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

// POST - criar nova lista de compras
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, userId, items, status } = body;

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
        status: status || 'active',
      },
      include: {
        items: {
          include: {
            product: true
          }
        },
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

// GET - pega todas as listas de compras ou filtra por Id
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const userId = searchParams.get("userId");

    if (id) {
      const shoppingList = await prisma.shoppingList.findUnique({
        where: { id: parseInt(id) },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
      if (!shoppingList) {
        return NextResponse.json({ error: "Lista de compras não encontrada" }, { status: 404 });
      }
      return NextResponse.json(shoppingList);
    }

    const where = userId ? { userId: parseInt(userId) } : {};

    const shoppingLists = await prisma.shoppingList.findMany({
      where,
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Adiciona os totais calculados em cada lista
    const listsWithTotals = shoppingLists.map(list => {
      // Valor estimado: soma dos avgPrice dos produtos x quantidade
      const estimatedTotal = list.items.reduce((sum, item) => {
        const price = item.product?.avgPrice || 0;
        return sum + price * item.quantity;
      }, 0);
      // Valor real: soma dos actualPrice dos itens coletados, se existir
      const actualTotal = list.items.reduce((sum, item) => {
        if (item.collected && item.actualPrice) {
          return sum + item.actualPrice * item.quantity;
        }
        return sum;
      }, 0);
      return {
        ...list,
        estimatedTotal,
        actualTotal: actualTotal > 0 ? actualTotal : undefined,
      };
    });

    return NextResponse.json(listsWithTotals);
  } catch (error) {
    console.error("Falha ao buscar listas de compras:", error);
    return NextResponse.json(
      { error: "Falha ao buscar listas de compras" },
      { status: 500 }
    );
  }
}

// PATCH - atualiza lista de compras
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, name, status } = body;

    if (!id) {
      return NextResponse.json(
        { error: "É necessário o ID da lista de compras" },
        { status: 400 }
      );
    }

    const updatedShoppingList = await prisma.shoppingList.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(status && { status }),
      },
      include: {
        items: {
          include: {
            product: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(updatedShoppingList);
  } catch (error) {
    console.error("Falha ao atualizar lista de compras:", error);
    return NextResponse.json(
      { error: "Falha ao atualizar lista de compras" },
      { status: 500 }
    );
  }
}

// DELETE - deletar lista de compras
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "É necessário o ID da lista de compra" },
        { status: 400 }
      );
    }

    await prisma.shoppingList.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json(
      { message: "Lista de compras deletada com sucesso" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Falha ao deletar lista de compras:", error);
    return NextResponse.json(
      { error: "Falha ao deletar lista de compras" },
      { status: 500 }
    );
  }
}