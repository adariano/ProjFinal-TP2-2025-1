import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

// GET - Buscar todos os itens da lista de compras
export async function GET() {
  try {
    const shoppingListItems = await prisma.shoppingListItem.findMany({
      include: {
        shoppingList: true,
        product: true,
      },
    });
    return NextResponse.json(shoppingListItems);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar itens da lista de compras" },
      { status: 500 }
    );
  }
}

// POST - Criar novo item na lista de compras
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validação básica
    if (!body.shoppingListId || !body.productId || body.quantity == null) {
      return NextResponse.json(
        { error: "Lista de compras, produto e quantidade são obrigatórios" },
        { status: 400 }
      );
    }

    const shoppingListItem = await prisma.shoppingListItem.create({
      data: {
        shoppingListId: body.shoppingListId,
        productId: body.productId,
        quantity: body.quantity,
      },
      include: {
        shoppingList: true,
        product: true,
      },
    });

    return NextResponse.json(shoppingListItem, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao criar item na lista de compras" },
      { status: 500 }
    );
  }
}

// PATCH - Marcar item como comprado
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, quantity, purchased, action } = body;

    if (!id) {
      return NextResponse.json({ error: "ID do item é obrigatório" }, { status: 400 });
    }

    if (action === "updateQuantity") {
      if (quantity == null) {
        return NextResponse.json({ error: "Quantidade é obrigatória" }, { status: 400 });
      }

      const updatedItem = await prisma.shoppingListItem.update({
        where: { id },
        data: { quantity },
        include: { shoppingList: true, product: true },
      });

      return NextResponse.json(updatedItem);
    }

    if (action === "updatePurchased") {
      if (purchased == null) {
        return NextResponse.json({ error: "Status de compra é obrigatório" }, { status: 400 });
      }

      const updatedItem = await prisma.shoppingListItem.update({
        where: { id },
        data: { },
        include: { shoppingList: true, product: true },
      });

      return NextResponse.json(updatedItem);
    }

    return NextResponse.json({ error: "Ação inválida" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao atualizar item" }, { status: 500 });
  }
}

// DELETE - Deletar item da lista de compras
export async function DELETE(req: Request) {    
  try {
    const body = await req.json();

    // Validação básica
    if (!body.id) {
      return NextResponse.json(
        { error: "ID do item é obrigatório" },
        { status: 400 }
      );
    }

    await prisma.shoppingListItem.delete({
      where: { id: body.id },
    });

    return NextResponse.json({ message: "Item deletado com sucesso" });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao deletar item da lista de compras" },
      { status: 500 }
    );
  }
}