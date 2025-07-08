import request from 'supertest';
import { prisma } from '@/lib/prisma';
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
it('should update a market successfully', async () => {
  // Cria primeiro um mercado para atualizar
  const createRes = await request('http://localhost:3000')
    .post('/api/market')
    .send({
      name: 'Mercado Original',
      address: 'Rua 1',
      distance: 1.5,
      rating: 3.2,
    })

  const marketId = createRes.body.id

  // Atualiza o nome do mercado
  const patchRes = await request('http://localhost:3000')
    .patch(`/api/market/${marketId}`)
    .send({ name: 'Mercado Atualizado' })

  expect(patchRes.statusCode).toBe(200)
  expect(patchRes.body.name).toBe('Mercado Atualizado')
},10000)

it('should delete a market successfully', async () => {
  // Primeiro, cria um mercado para deletar
  const createRes = await request('http://localhost:3000')
    .post('/api/market')
    .send({
      name: 'Mercado a Deletar',
      address: 'Rua 9',
      distance: 3.2,
      rating: 3.5,
    })

  const marketId = createRes.body.id

  // Agora, envia o DELETE
  const deleteRes = await request('http://localhost:3000')
    .delete(`/api/market/${marketId}`)

  expect(deleteRes.statusCode).toBe(204) // 204 No Content
})
