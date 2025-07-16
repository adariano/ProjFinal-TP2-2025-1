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
    },
    {
      name: "Maria Santos", 
      email: "maria.santos@email.com",
      cpf: "23456789012",
      password: "123456",
      role: "USER" as const,
    },
    {
      name: "Administrador",
      email: "admin@economarket.com",
      cpf: "34567890123",
      password: "admin123",
      role: "ADMIN" as const,
    },
    {
      name: "Ana Costa",
      email: "ana.costa@email.com",
      cpf: "45678901234", 
      password: "123456",
      role: "USER" as const,
    },
  ];

  return userData;
}

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
    address: "Rua das Flores, 123 - Centro",
    distance: 0.8,
    rating: 4.2,
    phone: "(11) 3456-7890",
    hours: "Segunda a Sábado: 7h às 22h, Domingo: 8h às 20h",
    googleMapsUrl: "https://maps.google.com/extra-centro",
    priceLevel: "MEDIO",
    categories: "Supermercado, Mercearia, Padaria, Açougue",
    description: "Supermercado tradicional com grande variedade de produtos e excelente atendimento no centro da cidade.",
  },
  {
    name: "Carrefour Bairro",
    address: "Av. Principal, 456 - Jardim América",
    distance: 1.5,
    rating: 4.0,
    phone: "(11) 3567-8901",
    hours: "Segunda a Domingo: 6h às 24h",
    googleMapsUrl: "https://maps.google.com/carrefour-jardim-america",
    priceLevel: "MEDIO",
    categories: "Hipermercado, Eletrodomésticos, Roupas, Farmácia",
    description: "Hipermercado completo com produtos variados, funcionamento 24h e estacionamento próprio.",
  },
  {
    name: "Atacadão do Povo",
    address: "Rua do Comércio, 789 - Vila Nova",
    distance: 2.3,
    rating: 3.8,
    phone: "(11) 3678-9012",
    hours: "Segunda a Sábado: 8h às 20h",
    googleMapsUrl: "https://maps.google.com/atacadao-vila-nova",
    priceLevel: "BAIXO",
    categories: "Atacado, Mercearia, Limpeza, Bebidas",
    description: "Atacadão com preços populares, ideal para compras em maior quantidade e economia familiar.",
  },
  {
    name: "Mercado São José",
    address: "Rua São José, 321 - São José",
    distance: 1.2,
    rating: 4.5,
    phone: "(11) 3789-0123",
    hours: "Segunda a Sábado: 7h às 19h, Domingo: 8h às 18h",
    googleMapsUrl: "https://maps.google.com/mercado-sao-jose",
    priceLevel: "MEDIO",
    categories: "Mercado de Bairro, Hortifruti, Padaria, Açougue",
    description: "Mercado familiar com atendimento personalizado, produtos frescos e tradição no bairro São José.",
  },
  {
    name: "Hipermercado Nacional",
    address: "Av. Nacional, 654 - Centro",
    distance: 3.0,
    rating: 4.1,
    phone: "(11) 3890-1234",
    hours: "Segunda a Domingo: 7h às 23h",
    googleMapsUrl: "https://maps.google.com/hipermercado-nacional",
    priceLevel: "ALTO",
    categories: "Hipermercado, Gourmet, Importados, Eletrônicos",
    description: "Hipermercado premium com produtos gourmet, importados e seções especializadas para clientes exigentes.",
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