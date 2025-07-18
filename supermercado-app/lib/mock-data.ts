// Compatibility layer for transitioning from mock to real data
import { userAPI, productAPI, marketAPI, shoppingListAPI, authAPI } from './api';

// Legacy mock data - kept for compatibility during transition
export const mockUsers = [
  {
    id: 1,
    name: "Administrador",
    email: "admin@economarket.com",
    role: "ADMIN",
    cpf: "000.000.000-00",
    createdAt: "2024-01-01",
  },
  {
    id: 2,
    name: "João Silva",
    email: "joao@email.com",
    role: "USER",
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

// DEPRECATED: Use the real API endpoints instead
export const mockMarkets = [
  // Mock markets are now replaced by real database data
  // Use the /api/market or /api/market/nearby endpoints instead
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

// Real API functions that replace mock functions
export const authenticateUser = async (email: string, password: string) => {
  try {
    const response = await authAPI.login({ email, password });
    return { success: true, user: response.user };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Credenciais inválidas" 
    };
  }
}

export const createUser = async (userData: any) => {
  try {
    const user = await userAPI.create({
      name: userData.name,
      email: userData.email,
      cpf: userData.cpf,
      password: userData.password,
      role: userData.role || 'USER',
    });
    return { success: true, user };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Erro ao criar usuário" 
    };
  }
}

// Real data fetching functions
export const fetchUsers = async () => {
  try {
    return await userAPI.getAll();
  } catch (error) {
    console.error('Error fetching users:', error);
    return mockUsers; // Fallback to mock data
  }
}

export const fetchProducts = async () => {
  try {
    return await productAPI.getAll();
  } catch (error) {
    console.error('Error fetching products:', error);
    return mockProducts; // Fallback to mock data
  }
}

export const fetchMarkets = async () => {
  try {
    return await marketAPI.getAll();
  } catch (error) {
    console.error('Error fetching markets:', error);
    return mockMarkets; // Fallback to mock data
  }
}

export const fetchShoppingLists = async () => {
  try {
    return await shoppingListAPI.getAll();
  } catch (error) {
    console.error('Error fetching shopping lists:', error);
    return mockShoppingLists; // Fallback to mock data
  }
}

// Helper functions for data transformation
export const transformUserData = (user: any) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role.toLowerCase(),
  cpf: user.cpf,
  createdAt: user.createdAt,
});

export const transformProductData = (product: any) => ({
  id: product.id,
  name: product.name,
  category: product.category,
  brand: product.brand,
  avgPrice: product.avgPrice,
  lastUpdate: product.lastUpdate,
});

export const transformMarketData = (market: any) => ({
  id: market.id,
  name: market.name,
  address: market.address,
  distance: market.distance,
  rating: market.rating,
});

export const transformShoppingListData = (list: any) => ({
  id: list.id,
  name: list.name,
  userId: list.userId,
  status: list.status,
  createdAt: list.createdAt,
  items: list.items || [],
});
