import { getDictionary } from "@/lib/dictionary";
import CreateMeeting from "@/routes/CreateMeeting";
import { Locale } from "@root/i18n.config";

export default async function Page({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const dict = await getDictionary(lang);

  return <CreateMeeting lang={lang} dict={dict} />;
}
