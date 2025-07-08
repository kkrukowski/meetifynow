import HomePage from "@/routes/HomePage";
import { Locale } from "@root/i18n.config";

export default function Page({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  return <HomePage lang={lang} />;
}
