import CreateMeeting from "@/components/CreateMeeting/CreateMeeting";
import { getDictionary } from "@/lib/dictionary";
import { Locale } from "@root/i18n.config";
import { auth } from "@src/auth.ts";

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
  // Auth session
  const session = await auth();

  const dict = await getDictionary(lang);

  return <CreateMeeting lang={lang} dict={dict} auth={session} />;
}
