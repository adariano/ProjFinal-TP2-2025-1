// Context for global application state
'use client';

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { userAPI, productAPI, marketAPI, shoppingListAPI } from '../lib/api';

interface User {
  id: number;
  name: string;
  email: string;
  cpf: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
}

interface Product {
  id: number;
  name: string;
  category: string;
  brand: string;
  avgPrice: number;
  lastUpdate: string;
}

interface Market {
  id: number;
  name: string;
  address: string;
  distance: number;
  rating: number;
}

interface ShoppingList {
  id: number;
  name: string;
  status: string;
  createdAt: string;
  userId: number;
  items?: any[];
}

interface AppState {
  user: User | null;
  users: User[];
  products: Product[];
  markets: Market[];
  shoppingLists: ShoppingList[];
  loading: {
    users: boolean;
    products: boolean;
    markets: boolean;
    shoppingLists: boolean;
  };
  error: {
    users: string | null;
    products: string | null;
    markets: string | null;
    shoppingLists: string | null;
  };
}

type AppAction = 
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_USERS'; payload: User[] }
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'SET_MARKETS'; payload: Market[] }
  | { type: 'SET_SHOPPING_LISTS'; payload: ShoppingList[] }
  | { type: 'SET_LOADING'; payload: { key: keyof AppState['loading']; value: boolean } }
  | { type: 'SET_ERROR'; payload: { key: keyof AppState['error']; value: string | null } }
  | { type: 'ADD_USER'; payload: User }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'REMOVE_USER'; payload: number }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: Product }
  | { type: 'REMOVE_PRODUCT'; payload: number }
  | { type: 'ADD_MARKET'; payload: Market }
  | { type: 'UPDATE_MARKET'; payload: Market }
  | { type: 'REMOVE_MARKET'; payload: number }
  | { type: 'ADD_SHOPPING_LIST'; payload: ShoppingList }
  | { type: 'UPDATE_SHOPPING_LIST'; payload: ShoppingList }
  | { type: 'REMOVE_SHOPPING_LIST'; payload: number };

const initialState: AppState = {
  user: null,
  users: [],
  products: [],
  markets: [],
  shoppingLists: [],
  loading: {
    users: false,
    products: false,
    markets: false,
    shoppingLists: false,
  },
  error: {
    users: null,
    products: null,
    markets: null,
    shoppingLists: null,
  },
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_USERS':
      return { ...state, users: action.payload };
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
    case 'SET_MARKETS':
      return { ...state, markets: action.payload };
    case 'SET_SHOPPING_LISTS':
      return { ...state, shoppingLists: action.payload };
    case 'SET_LOADING':
      return { 
        ...state, 
        loading: { ...state.loading, [action.payload.key]: action.payload.value }
      };
    case 'SET_ERROR':
      return { 
        ...state, 
        error: { ...state.error, [action.payload.key]: action.payload.value }
      };
    case 'ADD_USER':
      return { ...state, users: [...state.users, action.payload] };
    case 'UPDATE_USER':
      return { 
        ...state, 
        users: state.users.map(user => 
          user.id === action.payload.id ? action.payload : user
        )
      };
    case 'REMOVE_USER':
      return { 
        ...state, 
        users: state.users.filter(user => user.id !== action.payload)
      };
    case 'ADD_PRODUCT':
      return { ...state, products: [...state.products, action.payload] };
    case 'UPDATE_PRODUCT':
      return { 
        ...state, 
        products: state.products.map(product => 
          product.id === action.payload.id ? action.payload : product
        )
      };
    case 'REMOVE_PRODUCT':
      return { 
        ...state, 
        products: state.products.filter(product => product.id !== action.payload)
      };
    case 'ADD_MARKET':
      return { ...state, markets: [...state.markets, action.payload] };
    case 'UPDATE_MARKET':
      return { 
        ...state, 
        markets: state.markets.map(market => 
          market.id === action.payload.id ? action.payload : market
        )
      };
    case 'REMOVE_MARKET':
      return { 
        ...state, 
        markets: state.markets.filter(market => market.id !== action.payload)
      };
    case 'ADD_SHOPPING_LIST':
      return { ...state, shoppingLists: [...state.shoppingLists, action.payload] };
    case 'UPDATE_SHOPPING_LIST':
      return { 
        ...state, 
        shoppingLists: state.shoppingLists.map(list => 
          list.id === action.payload.id ? action.payload : list
        )
      };
    case 'REMOVE_SHOPPING_LIST':
      return { 
        ...state, 
        shoppingLists: state.shoppingLists.filter(list => list.id !== action.payload)
      };
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  actions: {
    // User actions
    setUser: (user: User | null) => void;
    fetchUsers: () => Promise<void>;
    createUser: (userData: any) => Promise<User>;
    updateUser: (id: number, userData: any) => Promise<User>;
    deleteUser: (id: number) => Promise<void>;
    
    // Product actions
    fetchProducts: () => Promise<void>;
    createProduct: (productData: any) => Promise<Product>;
    updateProduct: (id: number, productData: any) => Promise<Product>;
    deleteProduct: (id: number) => Promise<void>;
    
    // Market actions
    fetchMarkets: () => Promise<void>;
    createMarket: (marketData: any) => Promise<Market>;
    updateMarket: (id: number, marketData: any) => Promise<Market>;
    deleteMarket: (id: number) => Promise<void>;
    
    // Shopping List actions
    fetchShoppingLists: () => Promise<void>;
    createShoppingList: (listData: any) => Promise<ShoppingList>;
    updateShoppingList: (id: number, listData: any) => Promise<ShoppingList>;
    deleteShoppingList: (id: number) => Promise<void>;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Helper function to handle async operations
  const handleAsyncOperation = async <T,>(
    operation: () => Promise<T>,
    loadingKey: keyof AppState['loading'],
    errorKey: keyof AppState['error']
  ): Promise<T> => {
    dispatch({ type: 'SET_LOADING', payload: { key: loadingKey, value: true } });
    dispatch({ type: 'SET_ERROR', payload: { key: errorKey, value: null } });
    
    try {
      const result = await operation();
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      dispatch({ type: 'SET_ERROR', payload: { key: errorKey, value: errorMessage } });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: loadingKey, value: false } });
    }
  };

  const actions = {
    // User actions
    setUser: (user: User | null) => {
      dispatch({ type: 'SET_USER', payload: user });
    },
    
    fetchUsers: async () => {
      await handleAsyncOperation(
        async () => {
          const users = await userAPI.getAll();
          dispatch({ type: 'SET_USERS', payload: users });
          return users;
        },
        'users',
        'users'
      );
    },
    
    createUser: async (userData: any) => {
      return await handleAsyncOperation(
        async () => {
          const newUser = await userAPI.create(userData);
          dispatch({ type: 'ADD_USER', payload: newUser });
          return newUser;
        },
        'users',
        'users'
      );
    },
    
    updateUser: async (id: number, userData: any) => {
      return await handleAsyncOperation(
        async () => {
          const updatedUser = await userAPI.update(id, userData);
          dispatch({ type: 'UPDATE_USER', payload: updatedUser });
          return updatedUser;
        },
        'users',
        'users'
      );
    },
    
    deleteUser: async (id: number) => {
      await handleAsyncOperation(
        async () => {
          await userAPI.delete(id);
          dispatch({ type: 'REMOVE_USER', payload: id });
        },
        'users',
        'users'
      );
    },
    
    // Product actions
    fetchProducts: async () => {
      await handleAsyncOperation(
        async () => {
          const products = await productAPI.getAll();
          dispatch({ type: 'SET_PRODUCTS', payload: products });
          return products;
        },
        'products',
        'products'
      );
    },
    
    createProduct: async (productData: any) => {
      return await handleAsyncOperation(
        async () => {
          const newProduct = await productAPI.create(productData);
          dispatch({ type: 'ADD_PRODUCT', payload: newProduct });
          return newProduct;
        },
        'products',
        'products'
      );
    },
    
    updateProduct: async (id: number, productData: any) => {
      return await handleAsyncOperation(
        async () => {
          const updatedProduct = await productAPI.update(id, productData);
          dispatch({ type: 'UPDATE_PRODUCT', payload: updatedProduct });
          return updatedProduct;
        },
        'products',
        'products'
      );
    },
    
    deleteProduct: async (id: number) => {
      await handleAsyncOperation(
        async () => {
          await productAPI.delete(id);
          dispatch({ type: 'REMOVE_PRODUCT', payload: id });
        },
        'products',
        'products'
      );
    },
    
    // Market actions
    fetchMarkets: async () => {
      await handleAsyncOperation(
        async () => {
          const markets = await marketAPI.getAll();
          dispatch({ type: 'SET_MARKETS', payload: markets });
          return markets;
        },
        'markets',
        'markets'
      );
    },
    
    createMarket: async (marketData: any) => {
      return await handleAsyncOperation(
        async () => {
          const newMarket = await marketAPI.create(marketData);
          dispatch({ type: 'ADD_MARKET', payload: newMarket });
          return newMarket;
        },
        'markets',
        'markets'
      );
    },
    
    updateMarket: async (id: number, marketData: any) => {
      return await handleAsyncOperation(
        async () => {
          const updatedMarket = await marketAPI.update(id, marketData);
          dispatch({ type: 'UPDATE_MARKET', payload: updatedMarket });
          return updatedMarket;
        },
        'markets',
        'markets'
      );
    },
    
    deleteMarket: async (id: number) => {
      await handleAsyncOperation(
        async () => {
          await marketAPI.delete(id);
          dispatch({ type: 'REMOVE_MARKET', payload: id });
        },
        'markets',
        'markets'
      );
    },
    
    // Shopping List actions
    fetchShoppingLists: async () => {
      await handleAsyncOperation(
        async () => {
          const shoppingLists = await shoppingListAPI.getAll();
          dispatch({ type: 'SET_SHOPPING_LISTS', payload: shoppingLists });
          return shoppingLists;
        },
        'shoppingLists',
        'shoppingLists'
      );
    },
    
    createShoppingList: async (listData: any) => {
      return await handleAsyncOperation(
        async () => {
          const newList = await shoppingListAPI.create(listData);
          dispatch({ type: 'ADD_SHOPPING_LIST', payload: newList });
          return newList;
        },
        'shoppingLists',
        'shoppingLists'
      );
    },
    
    updateShoppingList: async (id: number, listData: any) => {
      return await handleAsyncOperation(
        async () => {
          const updatedList = await shoppingListAPI.update(id, listData);
          dispatch({ type: 'UPDATE_SHOPPING_LIST', payload: updatedList });
          return updatedList;
        },
        'shoppingLists',
        'shoppingLists'
      );
    },
    
    deleteShoppingList: async (id: number) => {
      await handleAsyncOperation(
        async () => {
          await shoppingListAPI.delete(id);
          dispatch({ type: 'REMOVE_SHOPPING_LIST', payload: id });
        },
        'shoppingLists',
        'shoppingLists'
      );
    },
  };

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await Promise.all([
          actions.fetchUsers(),
          actions.fetchProducts(),
          actions.fetchMarkets(),
          actions.fetchShoppingLists(),
        ]);
      } catch (error) {
        console.error('Error loading initial data:', error);
      }
    };

    loadInitialData();
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
