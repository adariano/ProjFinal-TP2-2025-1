// __tests__/user.test.ts

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

beforeAll(async () => {
  await prisma.$connect()
})

afterEach(async () => {
  await prisma.priceReport.deleteMany({})
  await prisma.review.deleteMany({})
  await prisma.shoppingListItem.deleteMany({})
  await prisma.shoppingList.deleteMany({})
  await prisma.user.deleteMany({})
})

afterAll(async () => {
  await prisma.$disconnect()
})

describe('User model TDD', () => {
  it('should fail to create a user without email', async () => {
    expect.assertions(1)
    try {
      const timestamp = Date.now()
      await prisma.user.create({
        data: {
          name: 'João',
          cpf: `123.456.${timestamp.toString().slice(-3)}-00`,
          password: 'password123'
          // email faltando
        } as any, // força o erro
      })
    } catch (error) {
      expect(error).toBeDefined()
    }
  })

  it('should create a user with valid data', async () => {
    const timestamp = Date.now()
    const user = await prisma.user.create({
      data: {
        name: 'João',
        email: `joao${timestamp}@email.com`,
        cpf: `123.456.${timestamp.toString().slice(-3)}-01`,
        password: 'password123'
      },
    })

    expect(user).toMatchObject({
      name: 'João',
      email: `joao${timestamp}@email.com`,
      cpf: `123.456.${timestamp.toString().slice(-3)}-01`,
      role: 'USER',
    })
  })
})
