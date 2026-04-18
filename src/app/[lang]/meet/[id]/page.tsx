import { getDictionary } from "@/lib/dictionary";
import AnswerMeeting from "@/routes/AnswerMeeting";
import { api } from "@root/convex/_generated/api";
import { Locale } from "@root/i18n.config";
import { fetchQuery } from "convex/nextjs";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const meeting = await fetchQuery(api.meetings.getByAppointmentId, {
      appointmentId: id,
    });
    if (!meeting) return { title: "Meeting Not Found - MeetifyNow" };
    return { title: meeting.meetName + " - MeetifyNow" };
  } catch {
    return { title: "MeetifyNow" };
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: Locale; id: string }>;
}) {
  const { lang, id } = await params;

  let dict, meeting;
  try {
    [dict, meeting] = await Promise.all([
      getDictionary(lang),
      fetchQuery(api.meetings.getByAppointmentId, { appointmentId: id }),
    ]);
  } catch {
    [dict] = await Promise.all([getDictionary(lang)]);
    return notFound();
  }

  if (!meeting) return notFound();

  return <AnswerMeeting lang={lang} dict={dict} meetingData={meeting} />;
}
