import request from 'supertest';

describe('Product API', () => {
  it('should create a product successfully', async () => {
    const res = await request('http://localhost:3000')
      .post('/api/product')
      .send({
        name: 'Produto Teste',
        price: 100.00,
        description: 'Descrição do produto teste',
        category: 'Categoria Teste',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Produto Teste');
  });

  it('should fetch all products successfully', async () => {
    const res = await request('http://localhost:3000')
      .get('/api/product');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});