import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User as SupabaseUser, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { getFromLocalStorage, setInLocalStorage, removeFromLocalStorage, STORAGE_KEYS } from '@/utils/localStorage';

interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  name: string;
  picture?: string;
  provider?: 'google' | 'email' | 'supabase';
  createdAt?: string;
  lastLogin?: string;
}

interface AuthState {
  user: User | null;
  supabaseUser: SupabaseUser | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: AuthError | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => void;
  isAdmin: () => boolean;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    supabaseUser: null,
    session: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Admin credentials should be handled via environment variables in production
  const ADMIN_CREDENTIALS = {
    email: import.meta.env.VITE_ADMIN_EMAIL || '',
    password: import.meta.env.VITE_ADMIN_PASSWORD || '',
    user: {
      id: 'admin-1',
      email: import.meta.env.VITE_ADMIN_EMAIL || '',
      role: 'admin' as const,
      name: 'Store Administrator',
    }
  };

  // Google OAuth login method
  const loginWithGoogle = async (): Promise<void> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

      const redirectUrl = import.meta.env.VITE_AUTH_CALLBACK_URL ||
                       'https://m-turboplay.com/auth/callback';
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          scopes: 'https://www.googleapis.com/auth/userinfo.email'
        }
      });

      if (error) {
        console.error('Error signing in with Google:', error);
        setAuthState(prev => ({
          ...prev,
          error,
          isLoading: false
        }));
        throw error;
      }
    } catch (err) {
      console.error('Error in loginWithGoogle:', err);
      setAuthState(prev => ({
        ...prev,
        error: err as AuthError,
        isLoading: false
      }));
      throw err;
    }
  };

  // Permission and role checking methods
  const isAdmin = (): boolean => {
    return authState.user?.role === 'admin';
  };

  const hasPermission = (permission: string): boolean => {
    const currentUser = authState.user;
    if (!currentUser) return false;

    // Admin has all permissions
    if (currentUser.role === 'admin') return true;

    // Add specific permission logic here based on your requirements
    const userPermissions: Record<string, string[]> = {
      user: ['view_products', 'add_to_cart', 'view_profile'],
      admin: ['*'], // All permissions
    };

    const rolePermissions = userPermissions[currentUser.role] || [];
    return rolePermissions.includes('*') || rolePermissions.includes(permission);
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

      // Try Supabase authentication first
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Supabase login error:', error);

        // Fallback to mock authentication for admin
        if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
          const user = ADMIN_CREDENTIALS.user;

          localStorage.setItem(STORAGE_KEYS.ADMIN_TOKEN, JSON.stringify(user));

          setAuthState({
            user,
            supabaseUser: null,
            session: null,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return true;
        }

        setAuthState(prev => ({
          ...prev,
          error,
          isLoading: false
        }));
        return false;
      }

      if (data.user && data.session) {
        // Authentication successful - user state will be updated by onAuthStateChange
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      setAuthState(prev => ({
        ...prev,
        error: error as AuthError,
        isLoading: false,
      }));
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Supabase logout error:', error);
        setAuthState(prev => ({ ...prev, error }));
      }
    } catch (error) {
      console.error('Logout error:', error);
      setAuthState(prev => ({
        ...prev,
        error: error as AuthError
      }));
    } finally {
      // Always clear local storage and state
      localStorage.removeItem(STORAGE_KEYS.ADMIN_TOKEN);

      setAuthState({
        user: null,
        supabaseUser: null,
        session: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  };

  const createUserFromSupabaseUser = (supabaseUser: SupabaseUser): User => {
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || ADMIN_CREDENTIALS.email;
    const isAdmin = supabaseUser.email === adminEmail || supabaseUser.email === 'mwaleedtam2016@gmail.com';

    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      role: isAdmin ? 'admin' : 'user',
      name: supabaseUser.user_metadata?.full_name ||
            supabaseUser.user_metadata?.name ||
            supabaseUser.email?.split('@')[0] || 'User',
      picture: supabaseUser.user_metadata?.avatar_url ||
               supabaseUser.user_metadata?.picture,
      provider: 'google',
      createdAt: supabaseUser.created_at,
      lastLogin: new Date().toISOString(),
    };
  };

  const checkAuth = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

      // Check Supabase session first
      const { data: { session }, error } = await supabase.auth.getSession();

      if (!error && session?.user) {
        const user = createUserFromSupabaseUser(session.user);

        // Store user data for persistence
        localStorage.setItem(STORAGE_KEYS.ADMIN_TOKEN, JSON.stringify(user));

        setAuthState({
          user,
          supabaseUser: session.user,
          session,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return;
      }

      // Check localStorage for stored token (fallback for mock admin)
      const userData = localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN);
      if (userData) {
        try {
          const user = JSON.parse(userData) as User;
          setAuthState({
            user,
            supabaseUser: null,
            session: null,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return;
        } catch (parseError) {
          // Invalid stored data, clear it
          localStorage.removeItem(STORAGE_KEYS.ADMIN_TOKEN);
        }
      }

      // No valid authentication found
      setAuthState({
        user: null,
        supabaseUser: null,
        session: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Auth check error:', error);
      setAuthState({
        user: null,
        supabaseUser: null,
        session: null,
        isAuthenticated: false,
        isLoading: false,
        error: error as AuthError,
      });
    }
  };

  useEffect(() => {
    checkAuth();

    // Listen for Supabase auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);

        if (event === 'SIGNED_OUT' || (!session && event !== 'INITIAL_SESSION')) {
          // Only clear localStorage if this is an explicit sign out, not initial session check
          localStorage.removeItem(STORAGE_KEYS.ADMIN_TOKEN);
          setAuthState({
            user: null,
            supabaseUser: null,
            session: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        } else if (event === 'SIGNED_IN' && session?.user) {
          const user = createUserFromSupabaseUser(session.user);

          localStorage.setItem(STORAGE_KEYS.ADMIN_TOKEN, JSON.stringify(user));
          setAuthState({
            user,
            supabaseUser: session.user,
            session,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          // Update session but keep existing user data
          setAuthState(prev => ({
            ...prev,
            session,
            supabaseUser: session.user,
          }));
        } else if (event === 'INITIAL_SESSION' && !session) {
          // On initial session check, don't clear localStorage - let checkAuth handle it
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const value: AuthContextType = {
    ...authState,
    login,
    loginWithGoogle,
    logout,
    checkAuth,
    isAdmin,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;