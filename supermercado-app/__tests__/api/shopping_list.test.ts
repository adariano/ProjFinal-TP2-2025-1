import { prisma } from "../../lib/prisma";

jest.setTimeout(20000); 

beforeEach(async () => {
  await prisma.$connect()
  // Cria o usuário se não existir
  await prisma.user.upsert({
    where: { id: 17 },
    update: {},
    create: {
      id: 17,
      name: 'Usuário Teste de Lista de Compras',
      email: 'TesteListadeCompras@example.com',
      cpf:"23446779012",
      role:"USER"
    }
  });
});

afterAll(async () => {
  await prisma.$disconnect()
})

describe('POST /api/shopping_list', () => {
  it('should create a new shopping list and return 201', async () => {
    // Cria um usuário para testar o POST
    await prisma.user.upsert({
    where: { id: 98 },
    update: {},
    create: {
      id: 98,
      name: 'Usuário Teste do método POST',
      email: 'posttest@example.com',
      cpf:"22146779612",
      role:"USER"
    }
  });
    const response = await fetch('http://localhost:3000/api/shopping_list', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Lista de Compras Teste',
        userId: 98
      }),
    });

    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data).toHaveProperty('id');
    expect(data.name).toBe('Lista de Compras Teste');
    expect(data.userId).toBe(98);
    expect(data.status).toBe('active');
  });
});

describe('GET /api/shopping_list', () => {
  it('should return a list of shopping lists with status 200', async () => {
    const response = await fetch('http://localhost:3000/api/shopping_list', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);

    if (data.length > 0) {
      expect(data[0]).toHaveProperty('id');
      expect(data[0]).toHaveProperty('name');
      expect(data[0]).toHaveProperty('status');
      expect(data[0]).toHaveProperty('createdAt');
      expect(data[0]).toHaveProperty('userId');
      expect(data[0]).toHaveProperty('items');
      expect(data[0]).toHaveProperty('user');
    }
  });
});

describe('GET SHOW /api/shopping_list ', () => {
  it('should return a specific shopping list by id with status 200', async () => {
    // Primeiro, cria uma lista para garantir que existe
    const createResponse = await fetch('http://localhost:3000/api/shopping_list', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Lista Show Teste',
        userId: 17 // Certifique-se que esse usuário existe
      }),
    });
    expect(createResponse.status).toBe(201);
    const created = await createResponse.json();

    // Agora, busca a lista pelo id
    const getResponse = await fetch(`http://localhost:3000/api/shopping_list?id=${created.id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    expect(getResponse.status).toBe(200);
    const data = await getResponse.json();
    expect(data).toHaveProperty('id', created.id);
    expect(data).toHaveProperty('name', 'Lista Show Teste');
    expect(data).toHaveProperty('userId', 17);
    expect(data).toHaveProperty('items');
    expect(data).toHaveProperty('user');
  });
});

describe('PATCH /api/shopping_list', () => {
  it('should update a shopping list and return the updated object', async () => {
    // Cria uma lista para garantir que existe
    const createResponse = await fetch('http://localhost:3000/api/shopping_list', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Lista Patch Teste',
        userId: 17 // Certifique-se que esse usuário existe
      }),
    });
    expect(createResponse.status).toBe(201);
    const created = await createResponse.json();

    // Atualiza a lista criada
    const patchResponse = await fetch('http://localhost:3000/api/shopping_list', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: created.id,
        name: 'Lista Atualizada',
        status: 'completed'
      }),
    });

    expect(patchResponse.status).toBe(200);
    const updated = await patchResponse.json();
    expect(updated).toHaveProperty('id', created.id);
    expect(updated).toHaveProperty('name', 'Lista Atualizada');
    expect(updated).toHaveProperty('status', 'completed');
    expect(updated).toHaveProperty('userId', 17);
    expect(updated).toHaveProperty('items');
    expect(updated).toHaveProperty('user');
  });
});

describe('DELETE /api/shopping_list', () => {
  it('should delete a shopping list and return a success message', async () => {
    // Cria uma lista para garantir que existe
    const createResponse = await fetch('http://localhost:3000/api/shopping_list', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Lista Delete Teste',
        userId: 17 // Certifique-se que esse usuário existe
      }),
    });
    expect(createResponse.status).toBe(201);
    const created = await createResponse.json();

    // Deleta a lista criada
    const deleteResponse = await fetch(`http://localhost:3000/api/shopping_list?id=${created.id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    expect(deleteResponse.status).toBe(200);
    const result = await deleteResponse.json();
    expect(result).toHaveProperty('message', 'Lista de compras deletada com sucesso');

    // Tenta buscar a lista deletada para garantir que não existe mais
    const getResponse = await fetch(`http://localhost:3000/api/shopping_list?id=${created.id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    expect(getResponse.status).toBe(404);
  });
});