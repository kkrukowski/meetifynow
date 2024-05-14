import { getDictionary } from "@/lib/dictionary";
import AnswerMeeting from "@/routes/AnswerMeeting";
import { Locale } from "@root/i18n.config";
import axios from "axios";
import type { Metadata } from "next";
import {notFound} from "next/navigation";
import {auth} from "@src/auth.ts";

let meetingData;

export async function generateMetadata({
  params: { id },
}: {
  params: { id: string };
}): Promise<Metadata> {
  const url = process.env.NEXT_PUBLIC_SERVER_URL + `/meet/${id}`;
  meetingData = await axios
    .get(url)
    .then((res) => res)
    .catch((err) => err.response);

  let title = "Answer Not Found - MeetifyNow";

  if (meetingData.status === 200) {
    title = meetingData.data.meetName + ` - MeetifyNow`;
  }

  return {
    title: title,
  };
}

export default async function Page({
  params: { lang, id },
}: {
  params: { lang: Locale; id: string };
}) {
  const session = await auth()

  // Get the dictionary for the given language
  const dict = await getDictionary(lang);

  // Check if the meeting exists
  const url = process.env.NEXT_PUBLIC_SERVER_URL + `/meet/${id}`;
  const res = await axios
    .get(url)
    .then((res) => res)
    .catch((err) => err.response);

  if (res.status === 200) {
    return <AnswerMeeting lang={lang} dict={dict} meetingData={res.data} session={session} />;
  }

  return notFound();
}
