import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface DiscountCode {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  usageLimit: number;
  usedCount: number;
  oneUserOnly: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface DiscountCodesContextType {
  discountCodes: DiscountCode[];
  isLoading: boolean;
  error: string | null;
  refreshDiscountCodes: () => void;
  addDiscountCode: (code: Omit<DiscountCode, 'id' | 'createdAt' | 'updatedAt' | 'usedCount'>) => Promise<boolean>;
  updateDiscountCode: (id: string, updates: Partial<DiscountCode>) => Promise<boolean>;
  deleteDiscountCode: (id: string) => Promise<boolean>;
  getDiscountCodeById: (id: string) => DiscountCode | undefined;
}

const DiscountCodesContext = createContext<DiscountCodesContextType | undefined>(undefined);

export const useDiscountCodes = () => {
  const context = useContext(DiscountCodesContext);
  if (!context) {
    throw new Error('useDiscountCodes must be used within a DiscountCodesProvider');
  }
  return context;
};

interface DiscountCodesProviderProps {
  children: ReactNode;
}

export const DiscountCodesProvider: React.FC<DiscountCodesProviderProps> = ({ children }) => {
  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDiscountCodes = () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const savedCodes = localStorage.getItem('admin_discount_codes');
      if (savedCodes) {
        setDiscountCodes(JSON.parse(savedCodes));
      } else {
        // Initialize with default codes
        const initialCodes: DiscountCode[] = [
          {
            id: '1',
            code: 'garden10',
            type: 'percentage',
            value: 10,
            usageLimit: 100,
            usedCount: 15,
            oneUserOnly: false,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: '2',
            code: 'mohmd',
            type: 'fixed',
            value: 143,
            usageLimit: 1,
            usedCount: 0,
            oneUserOnly: true,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: '3',
            code: '10qw',
            type: 'percentage',
            value: 50,
            usageLimit: 50,
            usedCount: 8,
            oneUserOnly: false,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: '4',
            code: '100x',
            type: 'percentage',
            value: 75,
            usageLimit: 25,
            usedCount: 3,
            oneUserOnly: false,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: '5',
            code: 'محمد12',
            type: 'percentage',
            value: 90,
            usageLimit: 1,
            usedCount: 0,
            oneUserOnly: true,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ];
        setDiscountCodes(initialCodes);
        localStorage.setItem('admin_discount_codes', JSON.stringify(initialCodes));
      }
    } catch (err) {
      setError('Failed to load discount codes');
      console.error('Error loading discount codes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDiscountCodes();
  }, []);

  const refreshDiscountCodes = () => {
    loadDiscountCodes();
  };

  const addDiscountCode = async (code: Omit<DiscountCode, 'id' | 'createdAt' | 'updatedAt' | 'usedCount'>): Promise<boolean> => {
    try {
      const newCode: DiscountCode = {
        ...code,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        usedCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updatedCodes = [...discountCodes, newCode];
      localStorage.setItem('admin_discount_codes', JSON.stringify(updatedCodes));
      setDiscountCodes(updatedCodes);
      return true;
    } catch (err) {
      console.error('Error adding discount code:', err);
      setError('Failed to add discount code');
      return false;
    }
  };

  const updateDiscountCode = async (id: string, updates: Partial<DiscountCode>): Promise<boolean> => {
    try {
      const updatedCodes = discountCodes.map(code =>
        code.id === id
          ? { ...code, ...updates, updatedAt: new Date().toISOString() }
          : code
      );
      localStorage.setItem('admin_discount_codes', JSON.stringify(updatedCodes));
      setDiscountCodes(updatedCodes);
      return true;
    } catch (err) {
      console.error('Error updating discount code:', err);
      setError('Failed to update discount code');
      return false;
    }
  };

  const deleteDiscountCode = async (id: string): Promise<boolean> => {
    try {
      const updatedCodes = discountCodes.filter(code => code.id !== id);
      localStorage.setItem('admin_discount_codes', JSON.stringify(updatedCodes));
      setDiscountCodes(updatedCodes);
      return true;
    } catch (err) {
      console.error('Error deleting discount code:', err);
      setError('Failed to delete discount code');
      return false;
    }
  };

  const getDiscountCodeById = (id: string): DiscountCode | undefined => {
    return discountCodes.find(code => code.id === id);
  };

  const value: DiscountCodesContextType = {
    discountCodes,
    isLoading,
    error,
    refreshDiscountCodes,
    addDiscountCode,
    updateDiscountCode,
    deleteDiscountCode,
    getDiscountCodeById,
  };

  return (
    <DiscountCodesContext.Provider value={value}>
      {children}
    </DiscountCodesContext.Provider>
  );
};

