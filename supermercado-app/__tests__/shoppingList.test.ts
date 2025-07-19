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
  await prisma.priceReport.deleteMany({})
  await prisma.review.deleteMany({})
  await prisma.shoppingListItem.deleteMany({})
  await prisma.shoppingList.deleteMany({})
  await prisma.user.deleteMany({})
  await prisma.product.deleteMany({})
  await prisma.market.deleteMany({})
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
    const timestamp = Date.now()
    const user = await prisma.user.create({
      data: {
        name: 'Maria',
        email: `maria${timestamp}@test.com`,
        cpf: `987.654.${timestamp.toString().slice(-3)}-01`,
        password: 'password123'
      },
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
