import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

beforeAll(async () => {
  await prisma.$connect()
})

afterAll(async () => {
  await prisma.priceReport.deleteMany({})
  await prisma.review.deleteMany({})
  await prisma.market.deleteMany({})
  await prisma.$disconnect()
})

describe('Market model TDD', () => {
  it('should fail to create a market without name', async () => {
    expect.assertions(1)
    try {
      await prisma.market.create({
        data: {
          // name missing
          address: '123 Main St',
          distance: 10.5,
          rating: 4.2,
        } as any,
      })
    } catch (error) {
      expect(error).toBeDefined()
    }
  })

  it('should create a market with valid data', async () => {
    const market = await prisma.market.create({
      data: {
        name: 'Supermarket X',
        address: '123 Main St',
        distance: 10.5,
        rating: 4.2,
      },
    })

    expect(market).toMatchObject({
      name: 'Supermarket X',
      address: '123 Main St',
      distance: 10.5,
      rating: 4.2,
    })
  })
})
