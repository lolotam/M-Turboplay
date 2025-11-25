// Simple auth store configuration for React Auth Kit
// For now, we'll use a simplified approach without React Auth Kit store
// and rely on our custom AuthContext

export const authStore = {
  authName: '_auth',
  authType: 'cookie',
  cookieDomain: typeof window !== 'undefined' ? window.location.hostname : 'localhost',
  cookieSecure: typeof window !== 'undefined' ? window.location.protocol === 'https:' : false,
};

export default authStore;
