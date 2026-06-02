import { useContext } from 'react';
import { CurrencyContext, type CurrencyContextType } from '@/context/currencyContextDef';

export function useCurrency(): CurrencyContextType {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider');
  return ctx;
}
