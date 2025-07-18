// PATCH - Aprova ou rejeita sugestão de produto
export async function PATCH(req) {
  try {
    const body = await req.json();
    const { id, status, reviewComment } = body;
    if (!id || !status) {
      return NextResponse.json({ error: "ID e novo status são obrigatórios" }, { status: 400 });
    }

    // Atualiza status da sugestão
    const updatedSuggestion = await prisma.productSuggestion.update({
      where: { id },
      data: {
        status,
        ...(reviewComment && { reviewComment }),
      },
    });

    // Se aprovado, adiciona ao catálogo de produtos
    if (status === "approved") {
      await prisma.product.create({
        data: {
          name: updatedSuggestion.name,
          brand: updatedSuggestion.brand,
          category: updatedSuggestion.category,
          avgPrice: updatedSuggestion.estimatedPrice || 0,
        },
      });
    }

    return NextResponse.json(updatedSuggestion);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao atualizar sugestão" }, { status: 500 });
  }
}
// POST - Cria uma nova sugestão de produto
export async function POST(req) {
  console.log('Sugestão recebida:', await req.clone().json());
  try {
    const body = await req.json();
    const {
      name,
      brand,
      category,
      description,
      estimatedPrice,
      barcode,
      reason,
      submittedBy,
      submittedEmail,
      status
    } = body;

    if (!name || !brand || !category || !submittedBy || !submittedEmail) {
      return NextResponse.json({ error: "Campos obrigatórios faltando" }, { status: 400 });
    }

    const suggestion = await prisma.productSuggestion.create({
      data: {
        name,
        brand,
        category,
        description,
        estimatedPrice: estimatedPrice ? Number(estimatedPrice) : undefined,
        barcode,
        reason,
        submittedBy,
        submittedEmail,
        status: status || "pending"
      }
    });
    return NextResponse.json(suggestion, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao criar sugestão" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

// GET - Lista todas as sugestões de produtos
export async function GET() {
  try {
    const suggestions = await prisma.productSuggestion.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(suggestions);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar sugestões" }, { status: 500 });
  }
}
