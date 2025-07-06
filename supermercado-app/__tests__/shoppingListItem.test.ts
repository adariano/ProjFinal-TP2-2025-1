import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

type AnyObj = any

beforeAll(async () => {
  await prisma.$connect()
})

afterAll(async () => {
  await prisma.shoppingListItem.deleteMany()
  await prisma.shoppingList.deleteMany()
  await prisma.product.deleteMany()
  await prisma.user.deleteMany()
  await prisma.$disconnect()
})

describe('ShoppingListItem model TDD', () => {
  it('should fail to create an item without productId', async () => {
    expect.assertions(1)
    try {
      await prisma.shoppingListItem.create({
        data: {
          quantity: 2,
          shoppingListId: 1,
          // productId missing
        } as AnyObj,
      })
    } catch (error) {
      expect(error).toBeDefined()
    }
  })

  it('should fail to create an item without shoppingListId', async () => {
    expect.assertions(1)
    try {
      await prisma.shoppingListItem.create({
        data: {
          quantity: 3,
          productId: 1,
          // shoppingListId missing
        } as AnyObj,
      })
    } catch (error) {
      expect(error).toBeDefined()
    }
  })

  it('should create an item with valid data', async () => {
    // create necessary parent records
    const user = await prisma.user.create({
      data: { name: 'Ana', email: 'ana@test.com', cpf: '111.222.333-44' },
    })
    const product = await prisma.product.create({
      data: { name: 'Milk', category: 'Dairy', brand: 'BrandY', avgPrice: 3.5 },
    })
    const list = await prisma.shoppingList.create({
      data: { name: 'List A', userId: user.id },
    })

    const item = await prisma.shoppingListItem.create({
      data: {
        quantity: 5,
        productId: product.id,
        shoppingListId: list.id,
      },
    })

    expect(item).toMatchObject({
      quantity: 5,
      collected: false,
      productId: product.id,
      shoppingListId: list.id,
    })
  })
})
