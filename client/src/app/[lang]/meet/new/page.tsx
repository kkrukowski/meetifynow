import { getDictionary } from "@/lib/dictionary";
import CreateMeeting from "@/routes/CreateMeeting";
import { Locale } from "@root/i18n.config";

export async function generateMetadata({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const dict = await getDictionary(lang);

  const title = dict.page.createMeeting.title + ` - MeetifyNow`;

  return {
    title,
  };
}

export default async function Page({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const dict = await getDictionary(lang);

  return <CreateMeeting lang={lang} dict={dict} />;
}
