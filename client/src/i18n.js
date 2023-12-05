import i18n from "i18next";
import Backend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";
import getWebsiteLanguage from "./utils/getWebsiteLanguage";

// Moment
import moment from "moment";
import "moment/dist/locale/pl";

const detectedLanguage = getWebsiteLanguage();

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    lng: detectedLanguage,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

moment.locale(detectedLanguage === "" ? "en" : detectedLanguage);

export default i18n;
