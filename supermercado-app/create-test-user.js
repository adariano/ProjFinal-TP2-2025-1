const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function createTestUser() {
  try {
    // Limpar usuários existentes
    await prisma.user.deleteMany()
    
    // Criar usuário de teste
    const user = await prisma.user.create({
      data: {
        name: 'João Silva',
        email: 'joao@test.com',
        cpf: '123.456.789-00',
        password: '123456', // senha simples para teste
      },
    })
    
    console.log('Usuário criado:', user)
    
    // Criar admin de teste  
    const admin = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@test.com',
        cpf: '987.654.321-00',
        password: 'admin123', // senha simples para teste
        role: 'ADMIN',
      },
    })
    
    console.log('Admin criado:', admin)
    
  } catch (error) {
    console.error('Erro ao criar usuários:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTestUser()
