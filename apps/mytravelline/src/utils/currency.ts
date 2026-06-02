export const SUPPORTED_CURRENCIES = [
  { code: 'USD', symbol: '$',  name: 'US Dollar' },
  { code: 'EUR', symbol: '€',  name: 'Euro' },
  { code: 'AMD', symbol: '֏', name: 'Armenian Dram' },
  { code: 'RUB', symbol: '₽', name: 'Russian Ruble' },
  { code: 'GBP', symbol: '£',  name: 'British Pound' },
] as const;

export type CurrencyCode = typeof SUPPORTED_CURRENCIES[number]['code'];

export function formatPrice(amount: number, currency: CurrencyCode, locale?: string): string {
  return new Intl.NumberFormat(locale || 'en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
