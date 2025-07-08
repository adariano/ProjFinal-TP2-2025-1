import request from 'supertest';
describe('Market API', () => {
  it('should create a market successfully', async () => {
    const res = await request('http://localhost:3000')
      .post('/api/market')
      .send({
        name: 'Mercado Exemplo',
        address: 'Rua dos Testes, 123',
        distance: 1.2,
        rating: 4.5,
      });
    expect(res.statusCode).toBe(201); // <- deve falhar no início
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Mercado Exemplo');
  });
});
