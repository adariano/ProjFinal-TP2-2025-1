import request from 'supertest';

describe('Product API', () => {
  it('should create a product successfully', async () => {
    const res = await request('http://localhost:3001')
      .post('/api/product')
      .send({
        name: 'Produto Teste',
        category: 'Categoria Teste',
        brand: 'Marca Teste',
        avgPrice: 100.00,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Produto Teste');
  });

  it('should fetch all products successfully', async () => {
    const res = await request('http://localhost:3001')
      .get('/api/product');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});