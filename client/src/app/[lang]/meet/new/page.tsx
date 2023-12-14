import CreateMeeting from "@/routes/CreateMeeting";
import { Locale } from "@root/i18n.config";

export default function Page({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  return <CreateMeeting lang={lang} />;
}
