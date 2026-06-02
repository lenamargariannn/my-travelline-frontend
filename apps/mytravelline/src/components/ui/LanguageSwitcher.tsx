import { useTranslation } from 'react-i18next';
import { useCurrency } from '@/hooks/useCurrency';
import type { CurrencyCode } from '@/utils/currency';

const languages = [
  { code: 'en', label: 'EN', flag: '🇬🇧' },
  { code: 'hy', label: 'HY', flag: '🇦🇲' },
  { code: 'ru', label: 'RU', flag: '🇷🇺' },
];

const languageCurrencyMap: Record<string, CurrencyCode> = {
  en: 'USD',
  hy: 'AMD',
  ru: 'RUB',
};

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const { setCurrency } = useCurrency();
  const current = i18n.language?.split('-')[0];

  const handleLanguageChange = (lng: string) => {
    i18n.changeLanguage(lng);
    const manuallySet = localStorage.getItem('currency_manually_set');
    if (!manuallySet) {
      setCurrency(languageCurrencyMap[lng] ?? 'USD');
    }
  };

  return (
    <div className="flex items-center gap-1">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => handleLanguageChange(lang.code)}
          className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors duration-200 ${
            current === lang.code
              ? 'bg-[#4A7E9B] text-white'
              : 'text-secondary-600 hover:text-[#4A7E9B]'
          }`}
        >
          <span>{lang.flag}</span>
          <span>{lang.label}</span>
        </button>
      ))}
    </div>
  );
}
