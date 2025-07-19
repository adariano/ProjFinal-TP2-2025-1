import request from 'supertest';
import { prisma } from '../../lib/prisma';

describe("Shopping List Item API", () => {
  beforeEach(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should return status 200 for GET request", async () => {
    const response = await request('http://localhost:3001')
      .get('/api/shopping_list_item');
    expect(response.status).toBe(200);
  });

  it("should return an array of shopping list items", async () => {
    // First create test data
    const timestamp = Date.now();
    const user = await prisma.user.create({
      data: {
        name: 'Test User',
        email: `testuser${timestamp}@example.com`,
        cpf: `123.456.${timestamp.toString().slice(-3)}-01`,
        password: 'password123'
      }
    });

    const product = await prisma.product.create({
      data: {
        name: `Test Product ${timestamp}`,
        category: 'Test Category',
        brand: 'Test Brand',
        avgPrice: 10.50
      }
    });

    const shoppingList = await prisma.shoppingList.create({
      data: {
        name: 'Test Shopping List',
        userId: user.id
      }
    });

    const shoppingListItem = await prisma.shoppingListItem.create({
      data: {
        quantity: 2,
        productId: product.id,
        shoppingListId: shoppingList.id
      }
    });

    const response = await request('http://localhost:3001')
      .get('/api/shopping_list_item');
    
    const data = response.body;
    expect(Array.isArray(data)).toBe(true);
    // Now we verify we can find our created item
    const createdItem = data.find((item: any) => item.id === shoppingListItem.id);
    expect(createdItem).toBeDefined();
    expect(createdItem).toHaveProperty("id");
    expect(createdItem).toHaveProperty("shoppingListId");
    expect(createdItem).toHaveProperty("productId");
    expect(createdItem).toHaveProperty("quantity");
    expect(createdItem).toHaveProperty("collected");
  });

  it("should create a shopping list item successfully", async () => {
    const timestamp = Date.now();
    const user = await prisma.user.create({
      data: {
        name: 'Test User 2',
        email: `testuser2${timestamp}@example.com`,
        cpf: `123.456.${timestamp.toString().slice(-3)}-02`,
        password: 'password123'
      }
    });

    const product = await prisma.product.create({
      data: {
        name: `Test Product 2 ${timestamp}`,
        category: 'Test Category',
        brand: 'Test Brand',
        avgPrice: 15.75
      }
    });

    const shoppingList = await prisma.shoppingList.create({
      data: {
        name: 'Test Shopping List 2',
        userId: user.id
      }
    });

    const response = await request('http://localhost:3001')
      .post('/api/shopping_list_item')
      .send({
        quantity: 3,
        productId: product.id,
        shoppingListId: shoppingList.id
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.quantity).toBe(3);
    expect(response.body.productId).toBe(product.id);
    expect(response.body.shoppingListId).toBe(shoppingList.id);
  });
});
