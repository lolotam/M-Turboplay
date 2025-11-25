// Currency types and interfaces for multi-currency support

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  nameAr: string;
  decimals: number;
  exchangeRate: number; // Rate relative to KWD (base currency)
}

export interface CurrencyPrices {
  KWD: number;
  SAR: number;
  AED: number;
  QAR: number;
  EGP: number;
  USD: number;
  EUR: number;
}

export interface CurrencyContextType {
  currentCurrency: Currency;
  currencies: Currency[];
  setCurrency: (currencyCode: string) => void;
  formatPrice: (price: number | CurrencyPrices, currencyCode?: string) => string;
  convertPrice: (price: number, fromCurrency: string, toCurrency: string) => number;
  convertPrices: (prices: CurrencyPrices, toCurrency: string) => number;
  isLoading: boolean;
}

// Supported currencies with exchange rates (KWD as base = 1.000)
export const SUPPORTED_CURRENCIES: Currency[] = [
  {
    code: 'KWD',
    symbol: 'د.ك',
    name: 'Kuwaiti Dinar',
    nameAr: 'دينار كويتي',
    decimals: 3,
    exchangeRate: 1.000
  },
  {
    code: 'SAR',
    symbol: 'ر.س',
    name: 'Saudi Riyal',
    nameAr: 'ريال سعودي',
    decimals: 2,
    exchangeRate: 12.25
  },
  {
    code: 'AED',
    symbol: 'د.إ',
    name: 'UAE Dirham',
    nameAr: 'درهم إماراتي',
    decimals: 2,
    exchangeRate: 12.00
  },
  {
    code: 'QAR',
    symbol: 'ر.ق',
    name: 'Qatari Riyal',
    nameAr: 'ريال قطري',
    decimals: 2,
    exchangeRate: 11.90
  },
  {
    code: 'EGP',
    symbol: 'ج.م',
    name: 'Egyptian Pound',
    nameAr: 'جنيه مصري',
    decimals: 2,
    exchangeRate: 100.50
  },
  {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    nameAr: 'دولار أمريكي',
    decimals: 2,
    exchangeRate: 3.27
  },
  {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    nameAr: 'يورو',
    decimals: 2,
    exchangeRate: 3.45
  }
];

// Default currency
export const DEFAULT_CURRENCY = SUPPORTED_CURRENCIES[0]; // KWD

// Currency storage key
export const CURRENCY_STORAGE_KEY = 'growagarden_selected_currency';
