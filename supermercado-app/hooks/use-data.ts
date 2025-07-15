// Custom hooks for data fetching and state management
import { useState, useEffect, useCallback } from 'react';
import { userAPI, productAPI, marketAPI, shoppingListAPI, shoppingListItemAPI } from './api';

// Generic hook for async operations
export function useAsyncOperation<T>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (asyncOperation: () => Promise<T>) => {
    setLoading(true);
    setError(null);
    try {
      const result = await asyncOperation();
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, execute };
}

// Users hooks
export function useUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await userAPI.getAll();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const createUser = useCallback(async (userData: any) => {
    const newUser = await userAPI.create(userData);
    setUsers(prev => [...prev, newUser]);
    return newUser;
  }, []);

  const updateUser = useCallback(async (id: number, userData: any) => {
    const updatedUser = await userAPI.update(id, userData);
    setUsers(prev => prev.map(user => user.id === id ? updatedUser : user));
    return updatedUser;
  }, []);

  const deleteUser = useCallback(async (id: number) => {
    await userAPI.delete(id);
    setUsers(prev => prev.filter(user => user.id !== id));
  }, []);

  return {
    users,
    loading,
    error,
    createUser,
    updateUser,
    deleteUser,
    refreshUsers: fetchUsers,
  };
}

// Products hooks
export function useProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await productAPI.getAll();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const createProduct = useCallback(async (productData: any) => {
    const newProduct = await productAPI.create(productData);
    setProducts(prev => [...prev, newProduct]);
    return newProduct;
  }, []);

  const updateProduct = useCallback(async (id: number, productData: any) => {
    const updatedProduct = await productAPI.update(id, productData);
    setProducts(prev => prev.map(product => product.id === id ? updatedProduct : product));
    return updatedProduct;
  }, []);

  const deleteProduct = useCallback(async (id: number) => {
    await productAPI.delete(id);
    setProducts(prev => prev.filter(product => product.id !== id));
  }, []);

  return {
    products,
    loading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    refreshProducts: fetchProducts,
  };
}

// Markets hooks
export function useMarkets() {
  const [markets, setMarkets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMarkets = useCallback(async () => {
    try {
      setLoading(true);
      const data = await marketAPI.getAll();
      setMarkets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching markets');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMarkets();
  }, [fetchMarkets]);

  const createMarket = useCallback(async (marketData: any) => {
    const newMarket = await marketAPI.create(marketData);
    setMarkets(prev => [...prev, newMarket]);
    return newMarket;
  }, []);

  const updateMarket = useCallback(async (id: number, marketData: any) => {
    const updatedMarket = await marketAPI.update(id, marketData);
    setMarkets(prev => prev.map(market => market.id === id ? updatedMarket : market));
    return updatedMarket;
  }, []);

  const deleteMarket = useCallback(async (id: number) => {
    await marketAPI.delete(id);
    setMarkets(prev => prev.filter(market => market.id !== id));
  }, []);

  return {
    markets,
    loading,
    error,
    createMarket,
    updateMarket,
    deleteMarket,
    refreshMarkets: fetchMarkets,
  };
}

// Shopping Lists hooks
export function useShoppingLists() {
  const [shoppingLists, setShoppingLists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchShoppingLists = useCallback(async () => {
    try {
      setLoading(true);
      const data = await shoppingListAPI.getAll();
      setShoppingLists(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching shopping lists');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchShoppingLists();
  }, [fetchShoppingLists]);

  const createShoppingList = useCallback(async (listData: any) => {
    const newList = await shoppingListAPI.create(listData);
    setShoppingLists(prev => [...prev, newList]);
    return newList;
  }, []);

  const updateShoppingList = useCallback(async (id: number, listData: any) => {
    const updatedList = await shoppingListAPI.update(id, listData);
    setShoppingLists(prev => prev.map(list => list.id === id ? updatedList : list));
    return updatedList;
  }, []);

  const deleteShoppingList = useCallback(async (id: number) => {
    await shoppingListAPI.delete(id);
    setShoppingLists(prev => prev.filter(list => list.id !== id));
  }, []);

  return {
    shoppingLists,
    loading,
    error,
    createShoppingList,
    updateShoppingList,
    deleteShoppingList,
    refreshShoppingLists: fetchShoppingLists,
  };
}

// Shopping List Items hooks
export function useShoppingListItems(listId?: number) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    if (!listId) return;
    try {
      setLoading(true);
      const data = await shoppingListItemAPI.getByListId(listId);
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching items');
    } finally {
      setLoading(false);
    }
  }, [listId]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const createItem = useCallback(async (itemData: any) => {
    const newItem = await shoppingListItemAPI.create(itemData);
    setItems(prev => [...prev, newItem]);
    return newItem;
  }, []);

  const updateItem = useCallback(async (id: number, itemData: any) => {
    const updatedItem = await shoppingListItemAPI.update(id, itemData);
    setItems(prev => prev.map(item => item.id === id ? updatedItem : item));
    return updatedItem;
  }, []);

  const deleteItem = useCallback(async (id: number) => {
    await shoppingListItemAPI.delete(id);
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  return {
    items,
    loading,
    error,
    createItem,
    updateItem,
    deleteItem,
    refreshItems: fetchItems,
  };
}

// Individual entity hooks
export function useUser(id?: number) {
  const { data: user, loading, error, execute } = useAsyncOperation<any>();

  const fetchUser = useCallback(async () => {
    if (!id) return;
    return execute(() => userAPI.getById(id));
  }, [id, execute]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return { user, loading, error, refreshUser: fetchUser };
}

export function useProduct(id?: number) {
  const { data: product, loading, error, execute } = useAsyncOperation<any>();

  const fetchProduct = useCallback(async () => {
    if (!id) return;
    return execute(() => productAPI.getById(id));
  }, [id, execute]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return { product, loading, error, refreshProduct: fetchProduct };
}

export function useMarket(id?: number) {
  const { data: market, loading, error, execute } = useAsyncOperation<any>();

  const fetchMarket = useCallback(async () => {
    if (!id) return;
    return execute(() => marketAPI.getById(id));
  }, [id, execute]);

  useEffect(() => {
    fetchMarket();
  }, [fetchMarket]);

  return { market, loading, error, refreshMarket: fetchMarket };
}

export function useShoppingList(id?: number) {
  const { data: shoppingList, loading, error, execute } = useAsyncOperation<any>();

  const fetchShoppingList = useCallback(async () => {
    if (!id) return;
    return execute(() => shoppingListAPI.getById(id));
  }, [id, execute]);

  useEffect(() => {
    fetchShoppingList();
  }, [fetchShoppingList]);

  return { shoppingList, loading, error, refreshShoppingList: fetchShoppingList };
}
