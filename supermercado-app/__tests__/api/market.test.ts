import request from 'supertest'

const api = request('http://localhost:3000')

describe('Market API', () => {
  it('should create a market successfully', async () => {
    const res = await api.post('/api/market').send({
      name: 'Mercado TDD',
      address: 'Rua dos Testes, 123',
      distance: 3.2,
      rating: 4.0,
    })

    expect(res.statusCode).toBe(201)
    expect(res.body).toHaveProperty('id')
    expect(res.body.name).toBe('Mercado TDD')
  })
})
