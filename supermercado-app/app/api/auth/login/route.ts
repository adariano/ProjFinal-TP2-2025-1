import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    console.log('Tentativa de login para:', email);

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email e senha são obrigatórios' },
        { status: 400 }
      );
    }

    console.log('Testando conexão com o banco...');
    
    const user = await prisma.user.findUnique({
      where: { email },
    });

    console.log('Usuário encontrado:', user ? 'Sim' : 'Não');

    if (!user) {
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      );
    }

        // Verifica se o usuário está ativo
        if (user.status !== 'Ativo') {
          return NextResponse.json(
            { error: 'Usuário desativado. Entre em contato com o suporte.' },
            { status: 403 }
          );
        }

    // Verificar senha (comparação simples para teste)
    if (user.password !== password) {
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      );
    }

    const { password: userPassword, ...userWithoutPassword } = user;

    return NextResponse.json(
      { 
        message: 'Login realizado com sucesso',
        user: userWithoutPassword 
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Erro no login:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor: ' + (error?.message || 'Erro desconhecido') },
      { status: 500 }
    );
  }
}
