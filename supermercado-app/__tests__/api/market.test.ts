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

describe('Market API', () => {
  // Teste do POST que você já fez...

  it('should list all markets', async () => {
    const res = await request('http://localhost:3000').get('/api/market')

    expect(res.statusCode).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    // Pode testar se tem pelo menos 1 mercado criado
    expect(res.body.length).toBeGreaterThanOrEqual(1)
    // E conferir se tem a propriedade 'name' em algum item
    expect(res.body[0]).toHaveProperty('name')
  })
})
describe('Market API', () => {
  // ... testes anteriores

  it('should get a market by id', async () => {
    // Primeiro, crie um mercado para garantir que exista um id
    const createRes = await request('http://localhost:3000')
      .post('/api/market')
      .send({
        name: 'Mercado Show',
        address: 'Rua Show, 456',
        distance: 2.5,
        rating: 4.8,
      })
    expect(createRes.statusCode).toBe(201)
    const marketId = createRes.body.id

    // Agora, busque pelo id
    const res = await request('http://localhost:3000').get(`/api/market/${marketId}`)

    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveProperty('id', marketId)
    expect(res.body.name).toBe('Mercado Show')
  })
  it('should return 404 for non-existing market', async () => {
    const res = await request('http://localhost:3000').get('/api/market/99999999')
    expect(res.statusCode).toBe(404)
  })
})

