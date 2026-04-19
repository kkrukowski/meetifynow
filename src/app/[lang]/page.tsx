import { getDictionary } from "@/lib/dictionary";
import HomePage from "@/components/HomePage/HomePage";
import { Locale } from "@root/i18n.config";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return <HomePage lang={lang} dict={dict} />;
}
