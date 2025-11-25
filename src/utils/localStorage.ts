// Centralized localStorage utility to eliminate code duplication
// Provides consistent error handling and type safety

export class LocalStorageError extends Error {
  constructor(message: string, public readonly key: string) {
    super(message);
    this.name = 'LocalStorageError';
  }
}

/**
 * Safely get an item from localStorage with error handling and type safety
 */
export const getFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return defaultValue;
    }
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error reading from localStorage (key: ${key}):`, error);
    return defaultValue;
  }
};

/**
 * Safely set an item in localStorage with error handling
 */
export const setInLocalStorage = <T>(key: string, value: T): boolean => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error writing to localStorage (key: ${key}):`, error);
    return false;
  }
};

/**
 * Safely remove an item from localStorage
 */
export const removeFromLocalStorage = (key: string): boolean => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing from localStorage (key: ${key}):`, error);
    return false;
  }
};

/**
 * Check if localStorage is available
 */
export const isLocalStorageAvailable = (): boolean => {
  try {
    const testKey = '__localStorage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
};

/**
 * Get the size of localStorage in bytes (approximate)
 */
export const getLocalStorageSize = (): number => {
  if (!isLocalStorageAvailable()) return 0;
  
  let total = 0;
  for (const key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += localStorage.getItem(key)?.length || 0;
      total += key.length;
    }
  }
  return total;
};

/**
 * Clear all localStorage items with specific prefix
 */
export const clearLocalStorageWithPrefix = (prefix: string): boolean => {
  if (!isLocalStorageAvailable()) return false;
  
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    return true;
  } catch (error) {
    console.error(`Error clearing localStorage with prefix ${prefix}:`, error);
    return false;
  }
};

// Specific keys used in the application
export const STORAGE_KEYS = {
  ADMIN_TOKEN: 'admin_token',
  ADMIN_PRODUCTS: 'admin_products',
  ADMIN_ORDERS: 'admin_orders',
  ADMIN_MESSAGES: 'admin_messages',
  ADMIN_CONVERSATIONS: 'admin_conversations',
  CART: 'growgarden-cart',
  LANGUAGE: 'growgarden-language',
  USER_PREFERENCES: 'growgarden-preferences',
} as const;

// Type-safe wrappers for specific data
export const saveAdminToken = (token: string): boolean => {
  return setInLocalStorage(STORAGE_KEYS.ADMIN_TOKEN, btoa(token));
};

export const getAdminToken = (): string | null => {
  const encoded = getFromLocalStorage(STORAGE_KEYS.ADMIN_TOKEN, null);
  if (!encoded) return null;
  
  try {
    return atob(encoded);
  } catch {
    removeFromLocalStorage(STORAGE_KEYS.ADMIN_TOKEN);
    return null;
  }
};

export const clearAdminToken = (): boolean => {
  return removeFromLocalStorage(STORAGE_KEYS.ADMIN_TOKEN);
};