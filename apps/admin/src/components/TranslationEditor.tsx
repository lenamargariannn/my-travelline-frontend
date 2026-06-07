import { useState } from 'react';
import type { TranslationMap } from '@my-travelline/shared';

export interface FieldDef {
  key: string;
  label: string;
  multiline?: boolean;
}

type Locale = 'en' | 'hy' | 'ru';

const LOCALES: { code: Locale; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'hy', label: 'HY' },
  { code: 'ru', label: 'RU' },
];

interface Props {
  fields: FieldDef[];
  value: TranslationMap;
  onChange: (map: TranslationMap) => void;
}

export default function TranslationEditor({ fields, value, onChange }: Props) {
  const [activeLocale, setActiveLocale] = useState<Locale>('hy');

  const localeData = value[activeLocale] ?? {};

  const setField = (key: string, text: string) => {
    onChange({
      ...value,
      [activeLocale]: { ...localeData, [key]: text },
    });
  };

  return (
    <div className="border border-secondary-200 rounded-lg overflow-hidden">
      {/* Tab strip */}
      <div className="flex border-b border-secondary-200 bg-secondary-50">
        {LOCALES.map(({ code, label }) => (
          <button
            key={code}
            type="button"
            onClick={() => setActiveLocale(code)}
            className={`px-4 py-2 text-xs font-semibold transition-colors ${
              activeLocale === code
                ? 'bg-white text-primary-700 border-b-2 border-primary-600 -mb-px'
                : 'text-secondary-500 hover:text-secondary-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Fields */}
      <div className="space-y-3 p-4 bg-white">
        {fields.map(({ key, label, multiline }) => (
          <div key={key}>
            <label className="input-label">{label}</label>
            {multiline ? (
              <textarea
                className="input-field"
                rows={3}
                value={localeData[key] ?? ''}
                onChange={(e) => setField(key, e.target.value)}
                placeholder={`${label} in ${activeLocale.toUpperCase()}…`}
              />
            ) : (
              <input
                className="input-field"
                value={localeData[key] ?? ''}
                onChange={(e) => setField(key, e.target.value)}
                placeholder={`${label} in ${activeLocale.toUpperCase()}…`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
