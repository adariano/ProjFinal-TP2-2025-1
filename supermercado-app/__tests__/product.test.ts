import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

beforeAll(async () => {
  await prisma.$connect()
})

afterAll(async () => {
  await prisma.shoppingListItem.deleteMany()
  await prisma.shoppingList.deleteMany()
  await prisma.product.deleteMany()
  await prisma.$disconnect()
})

describe('Product model TDD', () => {
  it('should fail to create a product without name', async () => {
    expect.assertions(1)
    try {
      await prisma.product.create({
        data: {
          // name missing
          category: 'Beverages',
          brand: 'BrandX',
          avgPrice: 5.99,
        } as any,
      })
    } catch (error) {
      expect(error).toBeDefined()
    }
  })

  it('should create a product with valid data', async () => {
    const product = await prisma.product.create({
      data: {
        name: 'Orange Juice',
        category: 'Beverages',
        brand: 'BrandX',
        avgPrice: 5.99,
      },
    })

    expect(product).toMatchObject({
      name: 'Orange Juice',
      category: 'Beverages',
      brand: 'BrandX',
      avgPrice: 5.99,
    })
  })
})
