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

  it('should return a list of users', async () => {
    const res = await request('http://localhost:3000')
      .get('/api/user');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty('id');
      expect(res.body[0]).toHaveProperty('name');
      expect(res.body[0]).toHaveProperty('email');
      expect(res.body[0]).toHaveProperty('cpf');
    }
  });
});
