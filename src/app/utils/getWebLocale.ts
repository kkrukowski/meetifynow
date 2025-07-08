import { Locale } from "@root/i18n.config";
import { headers } from "next/headers";
import { cache } from "react";

export const getLocale = cache((): Locale => {
  const preference = headers().get("X-Language-Preference");
  return (preference ?? "en") as Locale;
});

export default getLocale;
