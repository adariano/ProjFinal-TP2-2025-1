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

  it('should update a user successfully', async () => {
    // Cria um usuário para editar
    const createRes = await request('http://localhost:3000')
      .post('/api/user')
      .send({
        name: 'Maria Teste',
        email: 'mariateste@example.com',
        cpf: '99988877766',
      });
    expect(createRes.statusCode).toBe(201);
    const userId = createRes.body.id;

    // Atualiza o usuário
    const patchRes = await request('http://localhost:3000')
      .patch(`/api/user/${userId}`)
      .send({
        name: 'Maria Editada',
        email: 'mariateste@example.com',
        cpf: '99988877766',
      });

    expect(patchRes.statusCode).toBe(200);
    expect(patchRes.body).toHaveProperty('id', userId);
    expect(patchRes.body.name).toBe('Maria Editada');
  });

  it('should delete a user successfully', async () => {
    // Cria um usuário para deletar
    const createRes = await request('http://localhost:3000')
      .post('/api/user')
      .send({
        name: 'Usuário Deletar',
        email: 'deletar@example.com',
        cpf: '11122233344',
      });
    expect(createRes.statusCode).toBe(201);
    const userId = createRes.body.id;

    // Deleta o usuário
    const deleteRes = await request('http://localhost:3000')
      .delete(`/api/user/${userId}`);

    expect(deleteRes.statusCode).toBe(200);
    expect(deleteRes.body).toHaveProperty('message');

    // Tenta buscar o usuário deletado (deve retornar 404 ou array sem o usuário)
    const getRes = await request('http://localhost:3000')
      .get(`/api/user/${userId}`);
    expect(getRes.statusCode === 404 || getRes.body === null || getRes.body.error).toBeTruthy();
  });
});
