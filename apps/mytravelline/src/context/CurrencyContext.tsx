import { useState, type ReactNode } from 'react';
import { SUPPORTED_CURRENCIES, type CurrencyCode, formatPrice as formatPriceUtil } from '@/utils/currency';
import { CurrencyContext } from './currencyContextDef';

const DEFAULT_CURRENCY: CurrencyCode =
  (import.meta.env.VITE_DEFAULT_CURRENCY as CurrencyCode | undefined) ?? 'USD';

const VALID_CODES = SUPPORTED_CURRENCIES.map((c) => c.code) as readonly string[];

function getInitialCurrency(): CurrencyCode {
  const stored = localStorage.getItem('preferred_currency');
  if (stored && VALID_CODES.includes(stored)) return stored as CurrencyCode;
  return DEFAULT_CURRENCY;
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>(getInitialCurrency);

  const setCurrency = (code: CurrencyCode) => {
    setSelectedCurrency(code);
    localStorage.setItem('preferred_currency', code);
  };

  const formatPrice = (amount: number) => formatPriceUtil(amount, selectedCurrency);

  return (
    <CurrencyContext.Provider value={{ selectedCurrency, setCurrency, formatPrice, currencies: SUPPORTED_CURRENCIES }}>
      {children}
    </CurrencyContext.Provider>
  );
}
