import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// GET - Buscar usuário por ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id);
    
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        shoppingLists: {
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar usuário' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar usuário
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id);
    const body = await req.json();
    
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      );
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name: body.name,
        email: body.email,
        cpf: body.cpf,
        role: body.role,
      },
    });

    return NextResponse.json(user);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Email ou CPF já está em uso' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: 'Erro ao atualizar usuário' },
      { status: 500 }
    );
  }
}

// DELETE - Deletar usuário
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id);
    
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      );
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json(
      { message: 'Usuário deletado com sucesso' },
      { status: 200 }
    );
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Erro ao deletar usuário' },
      { status: 500 }
    );
  }
}
