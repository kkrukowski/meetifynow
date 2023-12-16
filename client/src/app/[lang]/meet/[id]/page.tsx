import { getDictionary } from "@/lib/dictionary";
import AnswerMeeting from "@/routes/AnswerMeeting";
import { Locale } from "@root/i18n.config";
import axios from "axios";
import { notFound } from "next/navigation";

export default async function Page({
  params: { lang, id },
}: {
  params: { lang: Locale; id: string };
}) {
  // Get the dictionary for the given language
  const dict = await getDictionary(lang);

  // Check if the meeting exists
  const url = process.env.NEXT_PUBLIC_SERVER_URL + `/meet/${id}`;
  const res = await axios
    .get(url)
    .then((res) => res)
    .catch((err) => err.response);

  if (res.status === 200) {
    return <AnswerMeeting lang={lang} dict={dict} meetingData={res.data} />;
  }

  return notFound();
}
