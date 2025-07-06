// __tests__/users.test.ts
import request from 'supertest';
import { createServer } from 'http';
// import { app } from 'next/app'; // Removido porque não é necessário
import handler from "@/app/api/user/route"; // Ajuste o caminho conforme a estrutura do seu projeto

describe('User API', () => {
  it('should create a user successfully', async () => {
    const server = createServer(async (req, res) => {
      if (req.method === 'POST' && req.url === '/api/users') {
        const response = await handler(req as any);
        res.statusCode = response.status!;
        res.setHeader('Content-Type', 'application/json');
        const body = await response.json();
        res.end(JSON.stringify(body));
      }
    });

    await new Promise<void>((resolve) => server.listen(4000, () => resolve()));

    const res = await request('http://localhost:3000')
      .post('/api/users')
      .send({
        name: 'João da Silva',
        email: 'joao@example.com',
        cpf: '12345678900',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('João da Silva');

    server.close();
  });
});
