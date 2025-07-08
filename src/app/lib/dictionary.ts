import type { Locale } from "../../../i18n.config";
import { i18n } from "../../../i18n.config";

const dictionaries = {
  en: () => import("../dictionaries/en.json").then((module) => module.default),
  pl: () => import("../dictionaries/pl.json").then((module) => module.default),
};

export const getDictionary = async (locale: Locale) => {
  const selectedLocale =
    locale && locale in dictionaries ? locale : i18n.defaultLocale;
  return dictionaries[selectedLocale as keyof typeof dictionaries]();
};
