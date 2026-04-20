import CreateMeeting from "@/components/CreateMeeting/CreateMeeting";
import { getDictionary } from "@/lib/dictionary";
import { Locale } from "@root/i18n.config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return {
    title: dict.page.createMeeting.title + ` - MeetifyNow`,
    alternates: {
      canonical: `https://meetifynow.com/${lang === "en" ? "" : lang}/meet/new`,
      languages: {
        en: "https://meetifynow.com/meet/new",
        pl: "https://meetifynow.com/pl/meet/new",
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
  return <CreateMeeting lang={lang} dict={dict} />;
}
