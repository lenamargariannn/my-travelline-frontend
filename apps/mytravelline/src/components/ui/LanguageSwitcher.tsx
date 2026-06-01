import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', label: 'EN', flag: '🇬🇧' },
  { code: 'hy', label: 'HY', flag: '🇦🇲' },
  { code: 'ru', label: 'RU', flag: '🇷🇺' },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const current = i18n.language?.split('-')[0];

  return (
    <div className="flex items-center gap-1">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => i18n.changeLanguage(lang.code)}
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
