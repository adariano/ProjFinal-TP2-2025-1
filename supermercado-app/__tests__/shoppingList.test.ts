import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

type AnyObj = any

beforeAll(async () => {
  await prisma.$connect()
})

afterAll(async () => {
  await prisma.$disconnect()
})

afterEach(async () => {
  await prisma.shoppingListItem.deleteMany()
  await prisma.shoppingList.deleteMany()
  await prisma.user.deleteMany()
})

describe('ShoppingList model TDD', () => {
  it('should fail to create a shopping list without userId', async () => {
    expect.assertions(1)
    try {
      await prisma.shoppingList.create({
        data: {
          name: 'Weekly Groceries',
          // userId missing
        } as AnyObj,
      })
    } catch (error) {
      expect(error).toBeDefined()
    }
  })

  it('should create a shopping list with valid data', async () => {
    const user = await prisma.user.create({
      data: {
        name: "Maria",
        email: "maria@test.com",
        cpf: "987.654.321-00",
        password: "123456"
      }
    })
    const list = await prisma.shoppingList.create({
      data: {
        name: 'Weekly Groceries',
        userId: user.id,
      },
    })

    expect(list).toMatchObject({
      name: 'Weekly Groceries',
      userId: user.id,
      status: 'active',
    })
  })
})
