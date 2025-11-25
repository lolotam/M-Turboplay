import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Currency, 
  CurrencyPrices, 
  CurrencyContextType, 
  SUPPORTED_CURRENCIES, 
  DEFAULT_CURRENCY,
  CURRENCY_STORAGE_KEY 
} from '@/types/currency';
import { 
  formatPrice as formatPriceUtil, 
  convertPrice as convertPriceUtil,
  convertPricesFromObject,
  getCurrencyByCode 
} from '@/lib/currency';

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

interface CurrencyProviderProps {
  children: ReactNode;
}

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({ children }) => {
  const { i18n } = useTranslation();
  const [currentCurrency, setCurrentCurrency] = useState<Currency>(DEFAULT_CURRENCY);
  const [isLoading, setIsLoading] = useState(false);
  const isRTL = i18n.language === 'ar';

  // Load saved currency from localStorage on mount
  useEffect(() => {
    const savedCurrencyCode = localStorage.getItem(CURRENCY_STORAGE_KEY);
    if (savedCurrencyCode) {
      const savedCurrency = getCurrencyByCode(savedCurrencyCode);
      setCurrentCurrency(savedCurrency);
    }
  }, []);

  // Save currency to localStorage when it changes
  useEffect(() => {
    localStorage.setItem(CURRENCY_STORAGE_KEY, currentCurrency.code);
  }, [currentCurrency]);

  const setCurrency = (currencyCode: string) => {
    setIsLoading(true);
    
    // Simulate a brief loading state for smooth UX
    setTimeout(() => {
      const newCurrency = getCurrencyByCode(currencyCode);
      setCurrentCurrency(newCurrency);
      setIsLoading(false);
    }, 150);
  };

  const formatPrice = (price: number | CurrencyPrices, currencyCode?: string): string => {
    const targetCurrency = currencyCode ? getCurrencyByCode(currencyCode) : currentCurrency;
    return formatPriceUtil(price, targetCurrency, isRTL);
  };

  const convertPrice = (price: number, fromCurrency: string, toCurrency: string): number => {
    return convertPriceUtil(price, fromCurrency, toCurrency);
  };

  const convertPrices = (prices: CurrencyPrices, toCurrency: string): number => {
    return convertPricesFromObject(prices, toCurrency);
  };

  const value: CurrencyContextType = {
    currentCurrency,
    currencies: SUPPORTED_CURRENCIES,
    setCurrency,
    formatPrice,
    convertPrice,
    convertPrices,
    isLoading
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export default CurrencyProvider;
