"use client";

import Button from "@/components/Button";
import CopyLinkButton from "@/components/CopyLinkButton";
import DateSelectionStep from "@/components/CreateMeeting/DateSelectionStep";
import StepsIndicator from "@/components/CreateMeeting/StepsIndicator";
import TimeSelectionStep from "@/components/CreateMeeting/TimeSelectionStep";
import Title from "@/components/Title";
import { useCreateMeeting } from "@/hooks/useCreateMeeting";
import { Locale } from "@root/i18n.config";
import { useRouter } from "next/navigation";
import AnswerMeetingLoader from "../AnswerMeeting/AnswerMeetingLoader";
import MeetingDetailsStep from "./MeetingDetailsStep";

export default function CreateMeeting({
  lang,
  dict,
}: {
  lang: Locale;
  dict: any;
}) {
  const router = useRouter();
  const {
    currStep,
    delta,
    timepickerIndex,
    meetDetails,
    selectedDates,
    dateError,
    dateErrorText,
    errors,
    isRequestInProgress,
    createError,
    createdAppointmentId,
    dailyTimeRanges,
    mainFromTime,
    mainToTime,
    dailyHours,
    setMeetDetails,
    setTimepickerIndex,
    setSelectedDates,
    register,
    next,
    prev,
    stepsInfo,
    pushSelectedTimecell,
    popUnselectedTimecell,
    setMainFromTime,
    setMainToTime,
    handleDailyHourChange,
  } = useCreateMeeting({ lang, dict });

  if (isRequestInProgress) {
    return <AnswerMeetingLoader />;
  }

  if (createdAppointmentId) {
    const meetingUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/${lang}/meet/${createdAppointmentId}`
        : `/${lang}/meet/${createdAppointmentId}`;

    return (
      <main className="flex md:flex-1 h-full flex-col items-center justify-center px-5 py-10 pt-24 lg:p-24 lg:pt-28">
        <div className="flex flex-col items-center text-center max-w-md">
          <div className="text-5xl mb-4">🎉</div>
          <Title text={dict.page.createMeeting.success.title} />
          <p className="text-dark mt-2 mb-4">
            {dict.page.createMeeting.success.subtitle}
          </p>
          <div className="w-full bg-light border border-light-gray rounded-lg px-4 py-2 mb-2 break-all text-sm text-dark select-all">
            {meetingUrl}
          </div>
          <CopyLinkButton url={meetingUrl} dict={dict} className="mt-2" />
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Button
              text={dict.page.createMeeting.success.goToMeeting}
              onClick={() =>
                router.push(`/${lang}/meet/${createdAppointmentId}`)
              }
            />
            <button
              type="button"
              onClick={() => router.push(`/${lang}/meet/new`)}
              className="text-sm text-gray hover:text-dark underline underline-offset-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
            >
              {dict.page.createMeeting.success.createAnother}
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex md:flex-1 h-full flex-col px-5 py-10 pt-24 lg:p-24 lg:pt-28 h-smd:pt-24 lg:m-0 justify-center">
      <div className="p-8 md:p-12 max-w-5xl mx-auto w-full bg-white rounded-xl shadow-sm border border-dark/5">
        <Title text={dict.page.createMeeting.title} />
        <StepsIndicator steps={4} stepsData={stepsInfo} currIndex={currStep} />
        <div
          id="create-meeting-form-container"
          className="flex flex-col justify-center min-h-[400px]"
        >
          <div className="w-full h-full flex flex-col justify-center">
            {currStep === 0 && (
              <MeetingDetailsStep
                delta={delta}
                register={register}
                errors={errors}
                dict={dict}
                setMeetDetails={setMeetDetails}
                meetDetails={meetDetails}
              />
            )}

            {currStep === 1 && (
              <DateSelectionStep
                delta={delta}
                selectedDates={[...selectedDates].sort((a, b) => a - b)}
                setSelectedDates={setSelectedDates}
                dateError={dateError}
                dateErrorText={dateErrorText}
              />
            )}

            {currStep === 2 && (
              <TimeSelectionStep
                dict={dict}
                delta={delta}
                timepickerIndex={timepickerIndex}
                setTimepickerIndex={setTimepickerIndex}
                mainFromTime={mainFromTime}
                mainToTime={mainToTime}
                setMainFromTime={setMainFromTime}
                setMainToTime={setMainToTime}
                dailyTimeRanges={dailyTimeRanges}
                dailyHours={dailyHours}
                handleDailyHourChange={handleDailyHourChange}
                pushSelectedTimecell={pushSelectedTimecell}
                popUnselectedTimecell={popUnselectedTimecell}
              />
            )}
          </div>
        </div>

        {createError && (
          <p className="self-center mt-3 text-sm text-red-500">{createError}</p>
        )}

        {currStep < 3 && (
          <div className="self-center mt-12 flex items-center gap-6 justify-center">
            {currStep > 0 && (
              <button
                type="button"
                onClick={prev}
                className="px-6 py-3 font-semibold text-gray/80 hover:text-dark hover:bg-gray/5 active:bg-gray/10 rounded-[20px] transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gray/20"
              >
                {dict.button.back}
              </button>
            )}
            <Button
              text={
                currStep === 2
                  ? dict.page.createMeeting.createButton
                  : dict.button.next
              }
              onClick={next}
              className="px-10"
            />
          </div>
        )}
      </div>
    </main>
  );
}
