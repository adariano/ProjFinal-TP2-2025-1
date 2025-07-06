import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

// POST - Criar novo usuário
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validação básica
    if (!body.name || !body.email || !body.cpf) {
      return NextResponse.json(
        { error: 'Nome, email e CPF são obrigatórios' },
        { status: 400 }
      );
    }

    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        cpf: body.cpf,
        role: body.role || 'USER',
      },
    });

    return NextResponse.json(user, { status: 201 });
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
