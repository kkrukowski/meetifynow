import HomePage from "@/routes/HomePage";
import { Locale } from "@root/i18n.config";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  return <HomePage lang={lang} />;
}
