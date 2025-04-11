"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector/cjs";

import translationTR from "./locales/tr/translation.json";
import translationEN from "./locales/en/translation.json";
import translationDE from "./locales/de/translation.json";

const resources = {
  tr: { translation: translationTR },
  en: { translation: translationEN },
  de: { translation: translationDE },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "tr",
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
