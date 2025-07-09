import { prisma } from "../../lib/prisma";

beforeAll(async () => {
  await prisma.$connect()
})

afterAll(async () => {
  await prisma.$disconnect()
})

describe('POST /api/shopping_list', () => {
  it('should create a new shopping list and return 201', async () => {
    const response = await fetch('http://localhost:3000/api/shopping_list', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Lista de Compras Teste',
        userId: 1
      }),
    });

    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data).toHaveProperty('id');
    expect(data.name).toBe('Lista de Compras Teste');
    expect(data.userId).toBe(1);
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
        userId: 1 // Certifique-se que esse usuário existe
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
    expect(data).toHaveProperty('userId', 1);
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
        userId: 1 // Certifique-se que esse usuário existe
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
    expect(updated).toHaveProperty('userId', 1);
    expect(updated).toHaveProperty('items');
    expect(updated).toHaveProperty('user');
  });
});