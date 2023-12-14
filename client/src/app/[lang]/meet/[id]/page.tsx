import AnswerMeeting from "@/routes/AnswerMeeting";
import { Locale } from "@root/i18n.config";

export default function Page({
  params,
}: {
  params: { lang: Locale; id: string };
}) {
  return <AnswerMeeting lang={params.lang} id={params.id} />;
}
