export const i18n = {
  defaultLocale: "en",
  locales: ["en", "pl"],
  localeDetection: false,
};

export type Locale = (typeof i18n)["locales"][number];
