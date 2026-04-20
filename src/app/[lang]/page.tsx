import HomePage from "@/components/HomePage/HomePage";
import { getDictionary } from "@/lib/dictionary";
import { Locale } from "@root/i18n.config";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return {
    alternates: {
      canonical: `https://meetifynow.com/${lang === "en" ? "" : lang}`,
      languages: {
        en: "https://meetifynow.com/",
        pl: "https://meetifynow.com/pl",
      },
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return <HomePage lang={lang} dict={dict} />;
}
