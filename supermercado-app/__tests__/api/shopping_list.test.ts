import request from 'supertest';
import { prisma } from '../../lib/prisma';

describe('Shopping List API', () => {
  beforeEach(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should create a shopping list successfully', async () => {
    // First create a user
    const timestamp = Date.now();
    const user = await prisma.user.create({
      data: {
        name: 'Test User',
        email: `test${timestamp}@example.com`,
        cpf: `123.456.${timestamp.toString().slice(-3)}-99`,
        password: 'password123'
      }
    });

    const res = await request('http://localhost:3001')
      .post('/api/shopping_list')
      .send({
        name: 'Test Shopping List',
        userId: user.id,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Test Shopping List');
    expect(res.body.userId).toBe(user.id);
  });

  it('should get all shopping lists', async () => {
    const res = await request('http://localhost:3001')
      .get('/api/shopping_list');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should return 400 for invalid shopping list data', async () => {
    const res = await request('http://localhost:3001')
      .post('/api/shopping_list')
      .send({
        name: 'Invalid List'
        // missing userId
      });

    expect(res.statusCode).toBe(400);
  });
});
