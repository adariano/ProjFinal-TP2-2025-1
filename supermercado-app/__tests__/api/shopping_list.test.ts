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