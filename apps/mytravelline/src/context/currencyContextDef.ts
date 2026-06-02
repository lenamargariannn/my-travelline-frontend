import { createContext } from 'react';
import type { SUPPORTED_CURRENCIES } from '@/utils/currency';
import type { CurrencyCode } from '@/utils/currency';

export interface CurrencyContextType {
  selectedCurrency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  formatPrice: (amount: number) => string;
  currencies: typeof SUPPORTED_CURRENCIES;
}

export const CurrencyContext = createContext<CurrencyContextType | null>(null);
