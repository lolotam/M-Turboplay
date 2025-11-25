import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Coins, Loader2 } from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';
import { getCurrencyName } from '@/lib/currency';

interface CurrencySelectorProps {
  variant?: 'button' | 'badge';
  size?: 'sm' | 'default';
  className?: string;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({ 
  variant = 'button', 
  size = 'sm',
  className = '' 
}) => {
  const { i18n } = useTranslation();
  const { currentCurrency, currencies, setCurrency, isLoading } = useCurrency();
  const isRTL = i18n.language === 'ar';

  const handleCurrencyChange = (currencyCode: string) => {
    if (currencyCode !== currentCurrency.code) {
      setCurrency(currencyCode);
    }
  };

  if (variant === 'badge') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 cursor-pointer ${className}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <>
                <Coins className={`w-3 h-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                {currentCurrency.symbol}
                <ChevronDown className={`w-3 h-3 ${isRTL ? 'mr-1' : 'ml-1'}`} />
              </>
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align={isRTL ? 'start' : 'end'} className="w-48">
          {currencies.map((currency) => (
            <DropdownMenuItem
              key={currency.code}
              onClick={() => handleCurrencyChange(currency.code)}
              className={`flex items-center justify-between cursor-pointer ${
                currency.code === currentCurrency.code ? 'bg-accent' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="font-medium">{currency.symbol}</span>
                <span className="text-sm">{currency.code}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {getCurrencyName(currency.code, isRTL)}
              </span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size={size}
          className={`relative ${className}`}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Coins className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {currentCurrency.symbol}
              <ChevronDown className={`w-3 h-3 ${isRTL ? 'mr-1' : 'ml-1'}`} />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={isRTL ? 'start' : 'end'} className="w-56">
        {currencies.map((currency) => (
          <DropdownMenuItem
            key={currency.code}
            onClick={() => handleCurrencyChange(currency.code)}
            className={`flex items-center justify-between cursor-pointer ${
              currency.code === currentCurrency.code ? 'bg-accent' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="font-medium text-base">{currency.symbol}</span>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{currency.code}</span>
                <span className="text-xs text-muted-foreground">
                  {getCurrencyName(currency.code, isRTL)}
                </span>
              </div>
            </div>
            {currency.code === currentCurrency.code && (
              <div className="w-2 h-2 bg-primary rounded-full" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CurrencySelector;
