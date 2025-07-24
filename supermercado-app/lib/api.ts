// API client functions for all endpoints
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

// Generic API request function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// User API functions
export const userAPI = {
  // Get all users
  getAll: () => apiRequest<any[]>('/api/user'),
  
  // Get user by ID
  getById: (id: number) => apiRequest<any>(`/api/user/${id}`),
  
  // Create new user
  create: (userData: {
    name: string;
    email: string;
    cpf: string;
    password?: string;
    role?: 'USER' | 'ADMIN';
  }) => apiRequest<any>('/api/user', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  // Update user
  update: (id: number, userData: {
    name?: string;
    email?: string;
    cpf?: string;
    role?: 'USER' | 'ADMIN';
  }) => apiRequest<any>(`/api/user/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(userData),
  }),
  
  // Delete user
  delete: (id: number) => apiRequest<{ message: string }>(`/api/user/${id}`, {
    method: 'DELETE',
  }),
};

// Product API functions
export const productAPI = {
  // Get all products
  getAll: () => apiRequest<any[]>('/api/product'),
  
  // Get product by ID
  getById: (id: number) => apiRequest<any>(`/api/product/${id}`),
  
  // Create new product
  create: (productData: {
    name: string;
    category: string;
    brand: string;
    avgPrice: number;
  }) => apiRequest<any>('/api/product', {
    method: 'POST',
    body: JSON.stringify(productData),
  }),
  
  // Update product
  update: (id: number, productData: {
    name?: string;
    category?: string;
    brand?: string;
    avgPrice?: number;
  }) => apiRequest<any>(`/api/product/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(productData),
  }),
  
  // Delete product
  delete: (id: number) => apiRequest<{ message: string }>(`/api/product/${id}`, {
    method: 'DELETE',
  }),
};

// Market API functions
export const marketAPI = {
  // Get all markets
  getAll: () => apiRequest<any[]>('/api/market'),
  
  // Get market by ID
  getById: (id: number) => apiRequest<any>(`/api/market/${id}`),
  
  // Create new market
  create: (marketData: {
    name: string;
    address: string;
    distance: number;
    rating: number;
  }) => apiRequest<any>('/api/market', {
    method: 'POST',
    body: JSON.stringify(marketData),
  }),
  
  // Update market
  update: (id: number, marketData: {
    name?: string;
    address?: string;
    distance?: number;
    rating?: number;
  }) => apiRequest<any>(`/api/market/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(marketData),
  }),
  
  // Delete market
  delete: (id: number) => apiRequest<{ message: string }>(`/api/market/${id}`, {
    method: 'DELETE',
  }),
};

// Shopping List API functions
export const shoppingListAPI = {
  // Get all shopping lists
  getAll: () => apiRequest<any[]>('/api/shopping_list'),
  
  // Get shopping list by ID
  getById: (id: number) => apiRequest<any>(`/api/shopping_list/${id}`),
  
  // Create new shopping list
  create: (listData: {
    name: string;
    userId: number;
    status?: string;
  }) => apiRequest<any>('/api/shopping_list', {
    method: 'POST',
    body: JSON.stringify(listData),
  }),
  
  // Update shopping list
  update: (id: number, listData: {
    name?: string;
    status?: string;
  }) => apiRequest<any>(`/api/shopping_list/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(listData),
  }),
  
  // Delete shopping list
  delete: (id: number) => apiRequest<{ message: string }>(`/api/shopping_list/${id}`, {
    method: 'DELETE',
  }),
};

// Shopping List Item API functions
export const shoppingListItemAPI = {
  // Get all items from a shopping list
  getByListId: (listId: number) => apiRequest<any[]>(`/api/shopping_list_item?listId=${listId}`),
  
  // Get item by ID
  getById: (id: number) => apiRequest<any>(`/api/shopping_list_item/${id}`),
  
  // Create new item
  create: (itemData: {
    quantity: number;
    productId: number;
    shoppingListId: number;
    collected?: boolean;
  }) => apiRequest<any>('/api/shopping_list_item', {
    method: 'POST',
    body: JSON.stringify(itemData),
  }),
  
  // Update item
  update: (id: number, itemData: {
    quantity?: number;
    collected?: boolean;
  }) => apiRequest<any>(`/api/shopping_list_item/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(itemData),
  }),
  
  // Delete item
  delete: (id: number) => apiRequest<{ message: string }>(`/api/shopping_list_item/${id}`, {
    method: 'DELETE',
  }),
};

// Authentication functions (if you have auth endpoints)
export const authAPI = {
  // Login
  login: (credentials: {
    email: string;
    password: string;
  }) => apiRequest<any>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  
  // Register
  register: (userData: {
    name: string;
    email: string;
    cpf: string;
    password: string;
  }) => apiRequest<any>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  // Logout
  logout: () => apiRequest<{ message: string }>('/api/auth/logout', {
    method: 'POST',
  }),
};
