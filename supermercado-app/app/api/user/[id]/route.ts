import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// PUT - Atualizar usuário
export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await req.json();
        const { id } = params;

        // Validação básica (pode ser expandida conforme necessário)
        if (!body.name && !body.email && !body.cpf && !body.role) {
            return NextResponse.json(
                { error: 'Nenhum dado para atualizar' },
                { status: 400 }
            );
        }

        const userId = Number(id);
        if (isNaN(userId)) {
            return NextResponse.json(
                { error: 'ID inválido' },
                { status: 400 }
            );
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                ...(body.name && { name: body.name }),
                ...(body.email && { email: body.email }),
                ...(body.cpf && { cpf: body.cpf }),
                ...(body.role && { role: body.role }),
            },
        });

        return NextResponse.json(updatedUser, { status: 200 });
    } catch (error: any) {
        if (error.code === 'P2002') {
            return NextResponse.json(
                { error: 'Email ou CPF já está em uso' },
                { status: 409 }
            );
        }
        if (error.code === 'P2025') {
            return NextResponse.json(
                { error: 'Usuário não encontrado' },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { error: 'Erro ao atualizar usuário' },
            { status: 500 }
        );
    }
}
