// Exemplo em um arquivo de rotas do Next.js (ex: /app/api/product/route.ts)

// Handler para POST /api/product
export async function POST(request: Request) {
  const body = await request.json();
  // Lógica para criar um produto no banco de dados...
  const newProduct = { id: 1, ...body }; // Exemplo
  return new Response(JSON.stringify(newProduct), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
}

// Handler para GET /api/product
export async function GET() {
  // Lógica para buscar todos os produtos no banco de dados...
  const products: any[] = []; // Exemplo
  return new Response(JSON.stringify(products), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}