import { useState, useRef, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useCurrency } from '@/hooks/useCurrency';
import type { CurrencyCode } from '@/utils/currency';

export default function CurrencySwitcher() {
  const { selectedCurrency, setCurrency, currencies } = useCurrency();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: CurrencyCode) => {
    localStorage.setItem('currency_manually_set', 'true');
    setCurrency(code);
    queryClient.invalidateQueries({ queryKey: ['tours'] });
    queryClient.invalidateQueries({ queryKey: ['destinations'] });
    setOpen(false);
  };

  const current = currencies.find((c) => c.code === selectedCurrency)!;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium text-secondary-600 hover:text-[#4A7E9B] transition-colors duration-200"
      >
        <span>{current.symbol}</span>
        <span>{current.code}</span>
        <span className="text-[10px]">▾</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 bg-white border border-secondary-200 rounded-lg shadow-lg z-50 min-w-[190px]">
          {currencies.map((c) => (
            <button
              key={c.code}
              onClick={() => handleSelect(c.code)}
              className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-secondary-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                c.code === selectedCurrency
                  ? 'text-[#4A7E9B] font-semibold bg-primary-50'
                  : 'text-secondary-600'
              }`}
            >
              <span className="w-4 shrink-0">{c.symbol}</span>
              <span className="font-medium">{c.code}</span>
              <span className="text-secondary-400">· {c.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
