// __tests__/user.test.ts

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

beforeAll(async () => {
  await prisma.$connect()
})

afterAll(async () => {
  await prisma.shoppingListItem.deleteMany()
  await prisma.shoppingList.deleteMany()
  await prisma.user.deleteMany()
  await prisma.$disconnect()
})

describe('User model TDD', () => {
  it('should fail to create a user without email', async () => {
    expect.assertions(1)
    try {
      await prisma.user.create({
        data: {
          name: 'João',
          cpf: '123.456.789-00',
          // email faltando
        } as any, // força o erro
      })
    } catch (error) {
      expect(error).toBeDefined()
    }
  })

  it('should create a user with valid data', async () => {
    const user = await prisma.user.create({
      data: {
        name: "João",
        email: "joao@email.com",
        cpf: "123.456.789-00",
        password: "123456"
      }
    })
    expect(user).toMatchObject({
      name: 'João',
      email: 'joao@email.com',
      cpf: '123.456.789-00',
      role: 'USER',
    })
  })
})
