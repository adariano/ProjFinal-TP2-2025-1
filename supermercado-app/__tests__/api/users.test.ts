// __tests__/users.test.ts
import request from 'supertest';

describe('User API', () => {
  // Use timestamp to ensure unique emails and CPFs
  const timestamp = Date.now();
  
  it('should create a user successfully', async () => {
    const res = await request('http://localhost:3001')
      .post('/api/user')
      .send({
        name: 'João da Silva',
        email: `joao${timestamp}@example.com`,
        cpf: `123456789${String(timestamp).slice(-2)}`,
        password: 'password123'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('João da Silva');
  });

  it('should return 400 for invalid user data', async () => {
    const res = await request('http://localhost:3001')
      .post('/api/user')
      .send({
        name: 'João',
        cpf: `123456789${String(timestamp + 1).slice(-2)}`,
        password: 'password123'
        // Missing email - should cause 400 error
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should return a list of users', async () => {
    const res = await request('http://localhost:3001')
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

  it('should update a user successfully', async () => {
    // Cria um usuário para editar
    const createRes = await request('http://localhost:3001')
      .post('/api/user')
      .send({
        name: 'Maria Teste',
        email: `mariateste${timestamp + 2}@example.com`,
        cpf: `999888777${String(timestamp + 2).slice(-2)}`,
        password: 'password123'
      });
    expect(createRes.statusCode).toBe(201);
    const userId = createRes.body.id;

    // Atualiza o usuário
    const patchRes = await request('http://localhost:3001')
      .patch(`/api/user/${userId}`)
      .send({
        name: 'Maria Editada'
      });

    expect(patchRes.statusCode).toBe(200);
    expect(patchRes.body).toHaveProperty('id', userId);
    expect(patchRes.body.name).toBe('Maria Editada');
  });

  it('should delete a user successfully', async () => {
    // Cria um usuário para deletar
    const createRes = await request('http://localhost:3001')
      .post('/api/user')
      .send({
        name: 'Usuário Deletar',
        email: `deletar${timestamp + 3}@example.com`,
        cpf: `111222333${String(timestamp + 3).slice(-2)}`,
        password: 'password123'
      });
    expect(createRes.statusCode).toBe(201);
    const userId = createRes.body.id;

    // Deleta o usuário
    const deleteRes = await request('http://localhost:3001')
      .delete(`/api/user/${userId}`);

    expect(deleteRes.statusCode).toBe(200);
    expect(deleteRes.body).toHaveProperty('message');

    const getRes = await request('http://localhost:3001')
      .get(`/api/user/${userId}`);
    expect(getRes.statusCode === 404 || getRes.body === null || getRes.body.error).toBeTruthy();
  });

  it('should return a user by id', async () => {
    // Cria um usuário para buscar
    const createRes = await request('http://localhost:3001')
      .post('/api/user')
      .send({
        name: 'Show User',
        email: `showuser${timestamp + 4}@example.com`,
        cpf: `555666777${String(timestamp + 4).slice(-2)}`,
        password: 'password123'
      });
    expect(createRes.statusCode).toBe(201);
    const userId = createRes.body.id;

    // Busca o usuário pelo id
    const getRes = await request('http://localhost:3001')
      .get(`/api/user/${userId}`);

    expect(getRes.statusCode).toBe(200);
    expect(getRes.body).toHaveProperty('id', userId);
    expect(getRes.body).toHaveProperty('name', 'Show User');
    expect(getRes.body).toHaveProperty('email', `showuser${timestamp + 4}@example.com`);
    expect(getRes.body).toHaveProperty('cpf', `555666777${String(timestamp + 4).slice(-2)}`);
  });
});
