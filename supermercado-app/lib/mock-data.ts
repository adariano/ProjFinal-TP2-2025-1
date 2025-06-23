// Mock database simulation
export const mockUsers = [
  {
    id: 1,
    name: "Administrador",
    email: "admin@economarket.com",
    role: "admin",
    cpf: "000.000.000-00",
    createdAt: "2024-01-01",
  },
  {
    id: 2,
    name: "João Silva",
    email: "joao@email.com",
    role: "user",
    cpf: "123.456.789-00",
    createdAt: "2024-12-15",
  },
]

export const mockProducts = [
  {
    id: 1,
    name: "Arroz Branco 5kg",
    category: "Grãos",
    brand: "Tio João",
    avgPrice: 18.9,
    lastUpdate: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Feijão Preto 1kg",
    category: "Grãos",
    brand: "Camil",
    avgPrice: 7.5,
    lastUpdate: new Date().toISOString(),
  },
  {
    id: 3,
    name: "Leite Integral 1L",
    category: "Laticínios",
    brand: "Parmalat",
    avgPrice: 4.5,
    lastUpdate: new Date().toISOString(),
  },
]

export const mockMarkets = [
  {
    id: 1,
    name: "Extra Hipermercado",
    address: "Av. Paulista, 1000",
    distance: 1.2,
    rating: 4.5,
  },
  {
    id: 2,
    name: "Pão de Açúcar",
    address: "Rua Augusta, 500",
    distance: 0.8,
    rating: 4.7,
  },
  {
    id: 3,
    name: "Carrefour",
    address: "Shopping Center Norte",
    distance: 2.1,
    rating: 4.2,
  },
]

export const mockShoppingLists = [
  {
    id: 1,
    name: "Compras da Semana",
    userId: 2,
    items: [
      { productId: 1, quantity: 1, collected: false },
      { productId: 2, quantity: 2, collected: true },
      { productId: 3, quantity: 3, collected: false },
    ],
    createdAt: "2025-01-20",
    status: "active",
  },
]

// Utility functions for mock data
export const authenticateUser = (email: string, password: string) => {
  // Simple mock authentication
  const user = mockUsers.find((u) => u.email === email)
  if (user) {
    return { success: true, user }
  }
  return { success: false, error: "Credenciais inválidas" }
}

export const createUser = (userData: any) => {
  // Mock user creation
  const newUser = {
    id: mockUsers.length + 1,
    ...userData,
    role: "user",
    createdAt: new Date().toISOString(),
  }
  mockUsers.push(newUser)
  return { success: true, user: newUser }
}
