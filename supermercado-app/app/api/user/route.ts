// PATCH - Ativa ou desativa usuário (exceto admin)
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status } = body;
    if (!id || !status) {
      return NextResponse.json({ error: 'ID e novo status são obrigatórios' }, { status: 400 });
    }
    // Busca usuário
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }
    if (user.role === 'ADMIN') {
      return NextResponse.json({ error: 'Não é permitido desativar/ativar um admin' }, { status: 403 });
    }
    const updated = await prisma.user.update({
      where: { id },
      data: { status },
    });
    return NextResponse.json({ success: true, updated });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar usuário' }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        cpf: true,
        role: true,
        createdAt: true,
        shoppingLists: true,
      },
    });
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar usuários' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.name || !body.email || !body.cpf || !body.password) {
      return NextResponse.json(
        { error: 'Nome, email, CPF e senha são obrigatórios' },
        { status: 400 }
      );
    }

    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        cpf: body.cpf,
        password: body.password,
        role: body.role || 'USER',
      },
    });

    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Email ou CPF já está em uso' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: 'Erro ao criar usuário' },
      { status: 500 }
    );
  }
}
