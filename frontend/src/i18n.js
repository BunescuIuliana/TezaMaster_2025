import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(Backend) // Încarcă traducerile din fișiere
  .use(LanguageDetector) // Detectează limba browser-ului
  .use(initReactI18next) // Integrează cu React
  .init({
    fallbackLng: 'en', // Limba implicită dacă traducerea nu este disponibilă
    debug: true, // Activează mesaje de debug în consolă
    interpolation: {
      escapeValue: false, // Nu este necesar pentru React
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json', // Calea către fișierele de traducere
    },
  });

export default i18n;