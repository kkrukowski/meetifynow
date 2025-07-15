"use client";

import React from "react";

// Components
import Button from "@/components/Button";
import DateSelectionStep from "@/components/CreateMeeting/DateSelectionStep";
import StepsIndicator from "@/components/CreateMeeting/StepsIndicator";
import TimeSelectionStep from "@/components/CreateMeeting/TimeSelectionStep";
import Title from "@/components/Title";
import AnswerMeetingLoader from "../../routes/AnswerMeetingLoader";
import MeetingDetailsStep from "./MeetingDetailsStep";

// Hooks
import { useCreateMeeting } from "@/hooks/useCreateMeeting";

import { Locale } from "@root/i18n.config";

export default function CreateMeeting({
  lang,
  dict,
  auth,
}: {
  lang: Locale;
  dict: any;
  auth: any;
}) {
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
  } = useCreateMeeting({ lang, dict, auth });

  if (isRequestInProgress) {
    return <AnswerMeetingLoader />;
  }

  return (
    <main className="flex md:flex-1 h-full flex-col px-5 py-10 pt-24 lg:p-24 lg:pt-28 h-smd:pt-24 lg:m-0 justify-center">
      <Title text={dict.page.createMeeting.title} />
      <StepsIndicator steps={4} stepsData={stepsInfo} currIndex={currStep} />
      <div
        id="create-meeting-form-container"
        className="flex flex-col justify-center md:h-[400px]"
      >
        <div className="self-center">
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
              selectedDates={selectedDates}
              setSelectedDates={setSelectedDates}
              dateError={dateError}
              dateErrorText={dateErrorText}
            />
          )}

          {currStep === 2 && (
            <TimeSelectionStep
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
      {/* Navigation */}
      {currStep < 3 && (
        <div className="self-center mt-5">
          <Button text={dict.button.back} onClick={prev} className="mr-10" />
          <Button
            text={`${
              currStep === 2
                ? dict.page.createMeeting.createButton
                : dict.button.next
            }`}
            onClick={next}
          />
        </div>
      )}
    </main>
  );
}
