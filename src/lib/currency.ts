// Currency utilities for formatting and conversion
import { Currency, CurrencyPrices, SUPPORTED_CURRENCIES, DEFAULT_CURRENCY } from '@/types/currency';

/**
 * Get currency by code
 */
export const getCurrencyByCode = (code: string): Currency => {
  return SUPPORTED_CURRENCIES.find(currency => currency.code === code) || DEFAULT_CURRENCY;
};

/**
 * Format price with proper currency symbol and decimal places
 */
export const formatPrice = (
  price: number | CurrencyPrices, 
  currency: Currency, 
  isRTL: boolean = false
): string => {
  let amount: number;
  
  // Handle both single price and multi-currency prices
  if (typeof price === 'number') {
    // Assume single price is in KWD (base currency) and convert to target currency
    amount = convertPrice(price, 'KWD', currency.code);
  } else {
    // Convert from CurrencyPrices object
    amount = convertPricesFromObject(price, currency.code);
  }

  // Format with proper decimal places
  const formattedAmount = amount.toFixed(currency.decimals);
  
  // Add thousand separators based on locale
  const parts = formattedAmount.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const finalAmount = parts.join('.');
  
  // Return formatted price with currency symbol
  if (isRTL) {
    return `${finalAmount} ${currency.symbol}`;
  } else {
    return `${currency.symbol} ${finalAmount}`;
  }
};

/**
 * Convert price between currencies
 */
export const convertPrice = (
  price: number, 
  fromCurrency: string, 
  toCurrency: string
): number => {
  const fromCurr = getCurrencyByCode(fromCurrency);
  const toCurr = getCurrencyByCode(toCurrency);
  
  // Convert to KWD first (base currency), then to target currency
  const priceInKWD = price / fromCurr.exchangeRate;
  const convertedPrice = priceInKWD * toCurr.exchangeRate;
  
  return convertedPrice;
};

/**
 * Convert from CurrencyPrices object to specific currency
 */
export const convertPricesFromObject = (
  prices: CurrencyPrices, 
  toCurrency: string
): number => {
  // If the target currency exists in the prices object, return it directly
  if (prices[toCurrency as keyof CurrencyPrices] !== undefined) {
    return prices[toCurrency as keyof CurrencyPrices];
  }
  
  // Otherwise, convert from KWD (base currency)
  return convertPrice(prices.KWD, 'KWD', toCurrency);
};

/**
 * Create CurrencyPrices object from a single KWD price
 */
export const createCurrencyPrices = (kwdPrice: number): CurrencyPrices => {
  return {
    KWD: kwdPrice,
    SAR: convertPrice(kwdPrice, 'KWD', 'SAR'),
    AED: convertPrice(kwdPrice, 'KWD', 'AED'),
    QAR: convertPrice(kwdPrice, 'KWD', 'QAR'),
    EGP: convertPrice(kwdPrice, 'KWD', 'EGP')
  };
};

/**
 * Validate currency prices object
 */
export const validateCurrencyPrices = (prices: Partial<CurrencyPrices>): boolean => {
  const requiredCurrencies = ['KWD', 'SAR', 'AED', 'QAR', 'EGP'];
  
  return requiredCurrencies.every(currency => {
    const price = prices[currency as keyof CurrencyPrices];
    return price !== undefined && price > 0 && !isNaN(price);
  });
};

/**
 * Get currency symbol by code
 */
export const getCurrencySymbol = (currencyCode: string): string => {
  const currency = getCurrencyByCode(currencyCode);
  return currency.symbol;
};

/**
 * Get currency name by code (localized)
 */
export const getCurrencyName = (currencyCode: string, isRTL: boolean = false): string => {
  const currency = getCurrencyByCode(currencyCode);
  return isRTL ? currency.nameAr : currency.name;
};

/**
 * Calculate percentage savings between original and current price
 */
export const calculateSavingsPercentage = (
  originalPrice: number | CurrencyPrices,
  currentPrice: number | CurrencyPrices,
  currency: Currency
): number => {
  let originalAmount: number;
  let currentAmount: number;
  
  if (typeof originalPrice === 'number') {
    originalAmount = originalPrice;
  } else {
    originalAmount = convertPricesFromObject(originalPrice, currency.code);
  }
  
  if (typeof currentPrice === 'number') {
    currentAmount = currentPrice;
  } else {
    currentAmount = convertPricesFromObject(currentPrice, currency.code);
  }
  
  if (originalAmount <= currentAmount) return 0;
  
  return Math.round(((originalAmount - currentAmount) / originalAmount) * 100);
};
