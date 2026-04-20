import AnswerMeeting from "@/components/AnswerMeeting/AnswerMeeting";
import { getDictionary } from "@/lib/dictionary";
import { Locale } from "@root/i18n.config";
import { fetchQuery } from "convex/nextjs";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { api } from "../../../../../convex/_generated/api";

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
    if (!meeting)
      return {
        title: "Meeting Not Found - MeetifyNow",
        robots: "noindex, nofollow",
      };
    return {
      title: meeting.meetName + " - MeetifyNow",
      robots: "noindex, nofollow",
      openGraph: {
        title: meeting.meetName,
        description:
          "Dołącz do utworzonego spotkania i zaznacz swoją dostępność.",
        url: `/meet/${id}`,
        type: "website",
      },
    };
  } catch {
    return { title: "MeetifyNow", robots: "noindex, nofollow" };
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
