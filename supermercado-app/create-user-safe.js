const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function createTestUser() {
  try {
    // Check if test user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'joao@test.com' }
    })
    
    if (existingUser) {
      console.log('Test user already exists:', existingUser)
      return existingUser
    }
    
    // Create test user
    const user = await prisma.user.create({
      data: {
        name: 'João Silva',
        email: 'joao@test.com',
        cpf: '123.456.789-00',
        password: '123456', // senha simples para teste
      },
    })
    
    console.log('Test user created:', user)
    
    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@test.com' }
    })
    
    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin)
      return { user, admin: existingAdmin }
    }
    
    // Create admin user
    const admin = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@test.com',
        cpf: '987.654.321-00',
        password: 'admin123', // senha simples para teste
        role: 'ADMIN',
      },
    })
    
    console.log('Admin user created:', admin)
    
    return { user, admin }
    
  } catch (error) {
    console.error('Error creating users:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTestUser()
