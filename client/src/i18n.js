import i18next from "i18next";
import Backend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";
import getWebsiteLanguage from "./utils/getWebsiteLanguage";

const detectedLanguage = getWebsiteLanguage();

i18next
  .use(Backend)
  .use(initReactI18next)
  .init({
    lng: detectedLanguage,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });
