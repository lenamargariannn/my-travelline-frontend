import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en/translation.json';
import hy from './locales/hy/translation.json';
import ru from './locales/ru/translation.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hy: { translation: hy },
      ru: { translation: ru },
    },
    fallbackLng: 'en',
    supportedLngs: ['en', 'hy', 'ru'],
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'i18n_language',
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
  });

i18n.on('languageChanged', (lng) => {
  document.documentElement.classList.remove('lang-en', 'lang-hy', 'lang-ru');
  document.documentElement.classList.add(`lang-${lng}`);
});

document.documentElement.classList.add(`lang-${i18n.language}`);

export default i18n;
