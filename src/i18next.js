import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import translationEn from "./locales/en/ENtranslation.json";
import translationEs from "./locales/es/EStranslation.json";

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    supportedLngs: ["en", "es"],
    resources: {
      en: {
        translation: translationEn,
      },
      es: {
        translation: translationEs,
      },
    },
    fallbackLng: "en",
    detection: { order: ["path", "cookie", "htmlTag"], caches: ["cookie"] },
    react: { useSuspense: true },
    backend: {
      loadPath: "./locales/{{lng}}/translation.json",
    },
  });
