import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

// Função para criar usuários com senhas simples (temporário)
async function createUsersWithSimplePasswords() {
  const userData = [
    {
      name: "João Silva",
      email: "joao.silva@email.com",
      cpf: "12345678901",
      password: "123456", // Senha simples para teste
      role: "USER" as const,
      status: "Ativo",
    },
    {
      name: "Maria Santos", 
      email: "maria.santos@email.com",
      cpf: "23456789012",
      password: "123456",
      role: "USER" as const,
      status: "Ativo",
    },
    {
      name: "Administrador",
      email: "admin@economarket.com",
      cpf: "34567890123",
      password: "admin123",
      role: "ADMIN" as const,
      status: "Ativo",
    },
    {
      name: "Ana Costa",
      email: "ana.costa@email.com",
      cpf: "45678901234", 
      password: "123456",
      role: "ADMIN" as const,
      status: "Ativo",
    },
  ];
  return userData;
}

// Dados de sugestões de produtos para testes do dashboard admin
const productSuggestions = [
  {
    name: "Açúcar Cristal União 1kg",
    brand: "União",
    category: "Grãos",
    description: "Açúcar cristal especial da marca União, embalagem de 1kg",
    estimatedPrice: 4.2,
    barcode: "7891234567890",
    reason: "Produto muito procurado pelos usuários, mas não está no catálogo",
    submittedBy: "Carlos Lima",
    submittedEmail: "carlos@email.com",
    status: "pending",
  },
  {
    name: "Farinha de Trigo Dona Benta 1kg",
    brand: "Dona Benta",
    category: "Grãos",
    description: "Farinha de trigo especial para pães e bolos",
    estimatedPrice: 5.5,
    barcode: "7891234567891",
    reason: "Usuários pedem para receitas caseiras",
    submittedBy: "Ana Souza",
    submittedEmail: "ana@email.com",
    status: "pending",
  },
];

// Dados de produtos
const productData: Prisma.ProductCreateInput[] = [
  {
    name: "Arroz Branco 5kg",
    category: "Grãos e Cereais",
    brand: "Tio João",
    avgPrice: 22.50,
  },
  {
    name: "Feijão Preto 1kg",
    category: "Grãos e Cereais",
    brand: "Camil",
    avgPrice: 8.90,
  },
  {
    name: "Açúcar Cristal 1kg",
    category: "Doces e Açúcares",
    brand: "União",
    avgPrice: 4.50,
  },
  {
    name: "Óleo de Soja 900ml",
    category: "Óleos e Temperos",
    brand: "Liza",
    avgPrice: 6.80,
  },
  {
    name: "Leite Integral 1L",
    category: "Laticínios",
    brand: "Parmalat",
    avgPrice: 5.20,
  },
  {
    name: "Pão de Forma Integral",
    category: "Padaria",
    brand: "Wickbold",
    avgPrice: 7.90,
  },
  {
    name: "Banana Prata kg",
    category: "Frutas",
    brand: "Natural",
    avgPrice: 4.90,
  },
  {
    name: "Tomate kg",
    category: "Legumes e Verduras",
    brand: "Natural",
    avgPrice: 6.50,
  },
  {
    name: "Detergente 500ml",
    category: "Limpeza",
    brand: "Ypê",
    avgPrice: 2.80,
  },
  {
    name: "Sabão em Pó 1kg",
    category: "Limpeza",
    brand: "OMO",
    avgPrice: 12.90,
  },
  {
    name: "Papel Higiênico 12 rolos",
    category: "Higiene",
    brand: "Neve",
    avgPrice: 18.50,
  },
  {
    name: "Shampoo 400ml",
    category: "Higiene",
    brand: "Seda",
    avgPrice: 11.90,
  },
  {
    name: "Macarrão Espaguete 500g",
    category: "Massas",
    brand: "Barilla",
    avgPrice: 4.20,
  },
  {
    name: "Molho de Tomate 340g",
    category: "Molhos e Conservas",
    brand: "Heinz",
    avgPrice: 3.50,
  },
  {
    name: "Refrigerante Cola 2L",
    category: "Bebidas",
    brand: "Coca-Cola",
    avgPrice: 8.90,
  },
];

// Dados de mercados
const marketData: Prisma.MarketCreateInput[] = [
  {
    name: "Supermercado Extra",
    address: "Av. Paulista, 1000 - Bela Vista, São Paulo - SP",
    distance: 0.8,
    rating: 4.2,
    phone: "(11) 3456-7890",
    hours: "Segunda a Sábado: 7h às 22h, Domingo: 8h às 20h",
    googleMapsUrl: "https://maps.google.com/?q=-23.5615,-46.6562",
    priceLevel: "MEDIO",
    categories: "Supermercado, Mercearia, Padaria, Açougue",
    description: "Supermercado tradicional com grande variedade de produtos e excelente atendimento no centro da cidade.",
    latitude: -23.5615,
    longitude: -46.6562,
  },
  {
    name: "Carrefour",
    address: "R. Barão de Itapetininga, 255 - República, São Paulo - SP",
    distance: 1.2,
    rating: 4.1,
    phone: "(11) 3257-4000",
    hours: "Segunda a Domingo: 6h às 24h",
    googleMapsUrl: "https://maps.app.goo.gl/j2128yUdykkD8xQ5A",
    priceLevel: "MEDIO",
    categories: "Hipermercado, Eletrodomésticos, Roupas, Farmácia",
    description: "Hipermercado Carrefour com produtos variados, funcionamento 24h e estacionamento próprio no centro de São Paulo.",
    latitude: -23.5431,
    longitude: -46.6364,
  },
  {
    name: "Dona de Casa",
    address: "Av. São João, 439 - Centro, São Paulo - SP",
    distance: 0.9,
    rating: 4.3,
    phone: "(11) 3333-4444",
    hours: "Segunda a Sábado: 7h às 21h, Domingo: 8h às 19h",
    googleMapsUrl: "https://maps.app.goo.gl/PtBx2Pq944YDqUWdA",
    priceLevel: "BAIXO",
    categories: "Supermercado, Mercearia, Hortifruti, Açougue",
    description: "Supermercado Dona de Casa com preços acessíveis, produtos frescos e atendimento familiar no centro histórico.",
    latitude: -23.5413,
    longitude: -46.6378,
  },
  {
    name: "Atacadão do Povo",
    address: "Av. Cruzeiro do Sul, 1500 - Canindé, São Paulo - SP",
    distance: 2.3,
    rating: 3.8,
    phone: "(11) 3678-9012",
    hours: "Segunda a Sábado: 8h às 20h",
    googleMapsUrl: "https://maps.google.com/?q=-23.5089,-46.6228",
    priceLevel: "BAIXO",
    categories: "Atacado, Mercearia, Limpeza, Bebidas",
    description: "Atacadão com preços populares, ideal para compras em maior quantidade e economia familiar.",
    latitude: -23.5089,
    longitude: -46.6228,
  },
  {
    name: "Mercado São José",
    address: "R. Haddock Lobo, 200 - Cerqueira César, São Paulo - SP",
    distance: 1.2,
    rating: 4.5,
    phone: "(11) 3789-0123",
    hours: "Segunda a Sábado: 7h às 19h, Domingo: 8h às 18h",
    googleMapsUrl: "https://maps.google.com/?q=-23.5629,-46.6544",
    priceLevel: "MEDIO",
    categories: "Mercado de Bairro, Hortifruti, Padaria, Açougue",
    description: "Mercado familiar com atendimento personalizado, produtos frescos e tradição no bairro São José.",
    latitude: -23.5629,
    longitude: -46.6544,
  },
  {
    name: "Hipermercado Nacional",
    address: "R. da Consolação, 300 - Centro, São Paulo - SP",
    distance: 3.0,
    rating: 4.1,
    phone: "(11) 3890-1234",
    hours: "Segunda a Domingo: 7h às 23h",
    googleMapsUrl: "https://maps.google.com/?q=-23.5431,-46.6291",
    priceLevel: "ALTO",
    categories: "Hipermercado, Gourmet, Importados, Eletrônicos",
    description: "Hipermercado premium com produtos gourmet, importados e seções especializadas para clientes exigentes.",
    latitude: -23.5431,
    longitude: -46.6291,
  },
  {
    name: "Pão de Açúcar",
    address: "Av. Brigadeiro Luís Antônio, 2013 - Bela Vista, São Paulo - SP",
    distance: 1.8,
    rating: 4.4,
    phone: "(11) 3149-5000",
    hours: "Segunda a Domingo: 6h às 24h",
    googleMapsUrl: "https://maps.google.com/?q=-23.5587,-46.6524",
    priceLevel: "ALTO",
    categories: "Supermercado, Gourmet, Padaria, Açougue",
    description: "Supermercado Pão de Açúcar com produtos de qualidade superior, seção gourmet e padaria artesanal.",
    latitude: -23.5587,
    longitude: -46.6524,
  },
  {
    name: "Mercadinho da Esquina",
    address: "R. 25 de Março, 100 - Centro, São Paulo - SP",
    distance: 0.5,
    rating: 3.9,
    phone: "(11) 3228-7777",
    hours: "Segunda a Sábado: 6h às 20h, Domingo: 7h às 18h",
    googleMapsUrl: "https://maps.google.com/?q=-23.5445,-46.6367",
    priceLevel: "BAIXO",
    categories: "Mercearia, Conveniência, Bebidas, Lanche",
    description: "Mercadinho de conveniência com produtos básicos, funcionamento estendido e preços acessíveis.",
    latitude: -23.5445,
    longitude: -46.6367,
  },
  {
    name: "Walmart Supercenter",
    address: "Av. das Nações Unidas, 3003 - Bonfim, São Paulo - SP",
    distance: 4.5,
    rating: 4.0,
    phone: "(11) 5506-8000",
    hours: "Segunda a Domingo: 7h às 23h",
    googleMapsUrl: "https://maps.google.com/?q=-23.5678,-46.6845",
    priceLevel: "MEDIO",
    categories: "Hipermercado, Eletrodomésticos, Roupas, Farmácia",
    description: "Walmart Supercenter com ampla variedade de produtos, preços competitivos e grandes instalações.",
    latitude: -23.5678,
    longitude: -46.6845,
  },
  {
    name: "Mercado Municipal",
    address: "R. da Cantareira, 306 - Centro, São Paulo - SP",
    distance: 1.1,
    rating: 4.6,
    phone: "(11) 3313-3365",
    hours: "Segunda a Sábado: 6h às 18h, Domingo: 6h às 16h",
    googleMapsUrl: "https://maps.google.com/?q=-23.5474,-46.6330",
    priceLevel: "ALTO",
    categories: "Mercado Municipal, Gourmet, Hortifruti, Especialidades",
    description: "Mercado Municipal histórico com produtos gourmet, especialidades regionais e tradição centenária.",
    latitude: -23.5474,
    longitude: -46.6330,
  },
  // Markets in Brasília for local testing
  {
    name: "Carrefour Brasília Shopping",
    address: "SCN Quadra 5 Bloco A - Asa Norte, Brasília - DF",
    distance: 3.2,
    rating: 4.1,
    phone: "(61) 3328-8000",
    hours: "Segunda a Domingo: 8h às 22h",
    googleMapsUrl: "https://maps.google.com/?q=-15.7890,-47.8901",
    priceLevel: "MEDIO",
    categories: "Hipermercado, Eletrodomésticos, Roupas, Farmácia",
    description: "Hipermercado Carrefour no Brasília Shopping com ampla variedade de produtos.",
    latitude: -15.7890,
    longitude: -47.8901,
  },
  {
    name: "Supermercado Comper",
    address: "SHCES Quadra 1304 - Cruzeiro Novo, Brasília - DF",
    distance: 0.8,
    rating: 4.3,
    phone: "(61) 3345-7000",
    hours: "Segunda a Sábado: 7h às 21h, Domingo: 8h às 20h",
    googleMapsUrl: "https://maps.google.com/?q=-15.8034,-47.8456",
    priceLevel: "MEDIO",
    categories: "Supermercado, Mercearia, Padaria, Açougue",
    description: "Supermercado Comper no Cruzeiro Novo, próximo ao SHCES 905.",
    latitude: -15.8034,
    longitude: -47.8456,
  },
  {
    name: "Extra Hiper Cruzeiro",
    address: "SCES Trecho 2 Conjunto 31 - Cruzeiro, Brasília - DF",
    distance: 1.2,
    rating: 4.0,
    phone: "(61) 3443-2000",
    hours: "Segunda a Domingo: 8h às 22h",
    googleMapsUrl: "https://maps.google.com/?q=-15.8020,-47.8380",
    priceLevel: "MEDIO",
    categories: "Hipermercado, Mercearia, Padaria, Açougue",
    description: "Extra Hipermercado no Cruzeiro com grande variedade de produtos.",
    latitude: -15.8020,
    longitude: -47.8380,
  },
  {
    name: "Atacadão Brasília",
    address: "SEPN Quadra 515 Bloco C - Asa Norte, Brasília - DF",
    distance: 4.5,
    rating: 3.9,
    phone: "(61) 3340-8000",
    hours: "Segunda a Sábado: 8h às 20h",
    googleMapsUrl: "https://maps.google.com/?q=-15.7750,-47.8850",
    priceLevel: "BAIXO",
    categories: "Atacado, Mercearia, Limpeza, Bebidas",
    description: "Atacadão com preços populares na Asa Norte de Brasília.",
    latitude: -15.7750,
    longitude: -47.8850,
  },
  {
    name: "Supermercado Vitória",
    address: "SCES Trecho 3 Conjunto 6 - Cruzeiro, Brasília - DF",
    distance: 0.9,
    rating: 4.2,
    phone: "(61) 3244-5000",
    hours: "Segunda a Sábado: 7h às 21h, Domingo: 8h às 19h",
    googleMapsUrl: "https://maps.google.com/?q=-15.8010,-47.8420",
    priceLevel: "BAIXO",
    categories: "Supermercado, Mercearia, Hortifruti, Açougue",
    description: "Supermercado de bairro no Cruzeiro com preços acessíveis.",
    latitude: -15.8010,
    longitude: -47.8420,
  },
  {
    name: "Pão de Açúcar Sudoeste",
    address: "CLN 201 Bloco A - Asa Norte, Brasília - DF",
    distance: 5.1,
    rating: 4.5,
    phone: "(61) 3328-4000",
    hours: "Segunda a Domingo: 7h às 23h",
    googleMapsUrl: "https://maps.google.com/?q=-15.7820,-47.8920",
    priceLevel: "ALTO",
    categories: "Supermercado, Gourmet, Padaria, Açougue",
    description: "Pão de Açúcar premium na Asa Norte com produtos gourmet.",
    latitude: -15.7820,
    longitude: -47.8920,
  },
  {
    name: "Mercadinho do Cruzeiro",
    address: "SHCES Quadra 1306 - Cruzeiro Novo, Brasília - DF",
    distance: 0.5,
    rating: 4.0,
    phone: "(61) 3245-6000",
    hours: "Segunda a Sábado: 6h às 20h, Domingo: 7h às 18h",
    googleMapsUrl: "https://maps.google.com/?q=-15.8040,-47.8470",
    priceLevel: "BAIXO",
    categories: "Mercearia, Conveniência, Bebidas, Lanche",
    description: "Mercadinho de conveniência muito próximo ao SHCES 905.",
    latitude: -15.8040,
    longitude: -47.8470,
  },
  // Markets in other Brazilian cities for broader coverage
  {
    name: "Supermercado Zona Sul",
    address: "R. Visconde de Pirajá, 351 - Ipanema, Rio de Janeiro - RJ",
    distance: 0.5,
    rating: 4.4,
    phone: "(21) 2540-8000",
    hours: "Segunda a Domingo: 7h às 23h",
    googleMapsUrl: "https://maps.google.com/?q=-22.9844,-43.2019",
    priceLevel: "ALTO",
    categories: "Supermercado, Gourmet, Padaria, Açougue",
    description: "Supermercado premium em Ipanema com produtos gourmet e atendimento diferenciado.",
    latitude: -22.9844,
    longitude: -43.2019,
  },
  {
    name: "Carrefour Bh",
    address: "Av. do Contorno, 4747 - Funcionários, Belo Horizonte - MG",
    distance: 1.8,
    rating: 4.0,
    phone: "(31) 3298-4000",
    hours: "Segunda a Domingo: 8h às 22h",
    googleMapsUrl: "https://maps.google.com/?q=-19.9245,-43.9352",
    priceLevel: "MEDIO",
    categories: "Hipermercado, Eletrodomésticos, Roupas, Farmácia",
    description: "Hipermercado Carrefour no centro de Belo Horizonte com ampla variedade de produtos.",
    latitude: -19.9245,
    longitude: -43.9352,
  },
  {
    name: "Comper Supermercados",
    address: "Av. Afonso Pena, 3997 - Centro, Campo Grande - MS",
    distance: 2.1,
    rating: 4.2,
    phone: "(67) 3314-5000",
    hours: "Segunda a Sábado: 7h às 21h, Domingo: 8h às 20h",
    googleMapsUrl: "https://maps.google.com/?q=-20.4697,-54.6178",
    priceLevel: "MEDIO",
    categories: "Supermercado, Mercearia, Padaria, Açougue",
    description: "Supermercado regional com produtos locais e atendimento familiar em Campo Grande.",
    latitude: -20.4697,
    longitude: -54.6178,
  },
  {
    name: "Supermercado Imperatriz",
    address: "Av. Getúlio Vargas, 1234 - Centro, Imperatriz - MA",
    distance: 1.3,
    rating: 4.1,
    phone: "(99) 3524-7000",
    hours: "Segunda a Sábado: 6h às 20h, Domingo: 7h às 19h",
    googleMapsUrl: "https://maps.google.com/?q=-5.5242,-47.4821",
    priceLevel: "BAIXO",
    categories: "Supermercado, Mercearia, Hortifruti, Açougue",
    description: "Supermercado popular no centro de Imperatriz com preços acessíveis e produtos regionais.",
    latitude: -5.5242,
    longitude: -47.4821,
  },
  {
    name: "Atacadão Recife",
    address: "Av. Caxangá, 2000 - Cordeiro, Recife - PE",
    distance: 3.2,
    rating: 3.9,
    phone: "(81) 3445-6000",
    hours: "Segunda a Sábado: 8h às 20h",
    googleMapsUrl: "https://maps.google.com/?q=-8.0476,-34.9015",
    priceLevel: "BAIXO",
    categories: "Atacado, Mercearia, Limpeza, Bebidas",
    description: "Atacadão com preços populares e produtos em quantidade no Recife.",
    latitude: -8.0476,
    longitude: -34.9015,
  },
  {
    name: "Supermercado Angeloni",
    address: "R. Felipe Schmidt, 390 - Centro, Florianópolis - SC",
    distance: 0.8,
    rating: 4.5,
    phone: "(48) 3251-4000",
    hours: "Segunda a Sábado: 7h às 22h, Domingo: 8h às 20h",
    googleMapsUrl: "https://maps.google.com/?q=-27.5969,-48.5495",
    priceLevel: "MEDIO",
    categories: "Supermercado, Mercearia, Padaria, Açougue",
    description: "Supermercado catarinense com tradição e qualidade no centro de Florianópolis.",
    latitude: -27.5969,
    longitude: -48.5495,
  },
];

export async function main() {
  console.log("Iniciando seed do banco de dados...");

  // Limpar dados existentes
  await prisma.shoppingListItem.deleteMany();
  await prisma.shoppingList.deleteMany();
  await prisma.product.deleteMany();
  await prisma.market.deleteMany();
  await prisma.user.deleteMany();

  console.log("Dados existentes removidos.");

  // Criar usuários
  console.log("Criando usuários...");
  const userData = await createUsersWithSimplePasswords();
  const createdUsers = [];
  for (const user of userData) {
    const createdUser = await prisma.user.create({ data: user });
    createdUsers.push(createdUser);
  }
  console.log(`${createdUsers.length} usuários criados.`);

  // Criar produtos
  console.log("Criando produtos...");
  const createdProducts = [];
  for (const product of productData) {
    const createdProduct = await prisma.product.create({ data: product });
    createdProducts.push(createdProduct);
  }
  console.log(`${createdProducts.length} produtos criados.`);

  // Criar mercados
  console.log("Criando mercados...");
  const createdMarkets = [];
  for (const market of marketData) {
    const createdMarket = await prisma.market.create({ data: market });
    createdMarkets.push(createdMarket);
  }
  console.log(`${createdMarkets.length} mercados criados.`);

  // Criar algumas listas de compras de exemplo
  console.log("Criando listas de compras de exemplo...");
  const shoppingList1 = await prisma.shoppingList.create({
    data: {
      name: "Compras da Semana",
      status: "active",
      userId: createdUsers[0].id,
      items: {
        create: [
          {
            quantity: 1,
            productId: createdProducts[0].id, // Arroz
          },
          {
            quantity: 2,
            productId: createdProducts[1].id, // Feijão
          },
          {
            quantity: 1,
            productId: createdProducts[4].id, // Leite
          },
          {
            quantity: 3,
            productId: createdProducts[6].id, // Banana
            collected: true,
          },
        ],
      },
    },
  });

  const shoppingList2 = await prisma.shoppingList.create({
    data: {
      name: "Produtos de Limpeza",
      status: "active",
      userId: createdUsers[1].id,
      items: {
        create: [
          {
            quantity: 2,
            productId: createdProducts[8].id, // Detergente
          },
          {
            quantity: 1,
            productId: createdProducts[9].id, // Sabão em pó
          },
          {
            quantity: 1,
            productId: createdProducts[10].id, // Papel higiênico
          },
        ],
      },
    },
  });

  const shoppingList3 = await prisma.shoppingList.create({
    data: {
      name: "Lista Finalizada",
      status: "completed",
      userId: createdUsers[0].id,
      items: {
        create: [
          {
            quantity: 1,
            productId: createdProducts[12].id, // Macarrão
            collected: true,
          },
          {
            quantity: 1,
            productId: createdProducts[13].id, // Molho de tomate
            collected: true,
          },
        ],
      },
    },
  });


  // Criar sugestões de produtos (mock para dashboard admin)
  console.log("Criando sugestões de produtos...");
  for (const suggestion of productSuggestions) {
    await prisma.productSuggestion?.create?.({
      data: suggestion,
    });
  }
  console.log("Sugestões de produtos criadas.");

  console.log("3 listas de compras criadas com itens.");
  console.log("Seed concluído com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });