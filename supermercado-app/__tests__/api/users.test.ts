// __tests__/users.test.ts
import request from 'supertest';

describe('User API', () => {
  it('should create a user successfully', async () => {
    const res = await request('http://localhost:3000')
      .post('/api/user')
      .send({
        name: 'João da Silva',
        email: 'joao@example.com',
        cpf: '12345678900',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('João da Silva');
  });

  it('should return 400 for invalid user data', async () => {
    const res = await request('http://localhost:3000')
      .post('/api/user')
      .send({
        name: 'João',
        cpf: '12345678900',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});
