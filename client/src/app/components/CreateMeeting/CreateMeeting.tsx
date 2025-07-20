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

  // DEBUG: Logowanie zmian stanu kroków
  React.useEffect(() => {
    console.log("🔢 DEBUG CreateMeeting: Zmiana kroku", {
      currStep,
      delta,
      stepTitle: stepsInfo[currStep]?.title,
      timestamp: new Date().toISOString(),
    });
  }, [currStep, delta]);

  // DEBUG: Logowanie wybranych dat
  React.useEffect(() => {
    console.log("📅 DEBUG CreateMeeting: Zaktualizowane wybrane daty", {
      selectedDatesCount: selectedDates.length,
      selectedDates: selectedDates.map((date) =>
        new Date(date).toLocaleDateString()
      ),
      selectedDatesRaw: selectedDates,
      timestamp: new Date().toISOString(),
    });
  }, [selectedDates]);

  // DEBUG: Logowanie błędów dat
  React.useEffect(() => {
    if (dateError) {
      console.log("❌ DEBUG CreateMeeting: Błąd walidacji dat", {
        dateError,
        dateErrorText,
        selectedDatesCount: selectedDates.length,
        timestamp: new Date().toISOString(),
      });
    }
  }, [dateError, dateErrorText]);

  // DEBUG: Logowanie zmian w zakresach czasowych
  React.useEffect(() => {
    console.log("⏰ DEBUG CreateMeeting: Zaktualizowane zakresy czasowe", {
      dailyTimeRangesCount: dailyTimeRanges.length,
      dailyTimeRanges: dailyTimeRanges.map((range) => ({
        date: new Date(range.date).toLocaleDateString(),
        timesCount: range.times?.length || 0,
        firstTime: range.times?.[0]
          ? new Date(range.times[0]).toLocaleString()
          : null,
        lastTime: range.times?.[range.times.length - 1]
          ? new Date(range.times[range.times.length - 1]).toLocaleString()
          : null,
      })),
      timestamp: new Date().toISOString(),
    });
  }, [dailyTimeRanges]);

  // DEBUG: Logowanie zmian w głównych godzinach
  React.useEffect(() => {
    console.log("🕐 DEBUG CreateMeeting: Zmiana głównych godzin", {
      mainFromTime,
      mainToTime,
      mainTimeRange: `${mainFromTime}:00 - ${mainToTime}:00`,
      timestamp: new Date().toISOString(),
    });
  }, [mainFromTime, mainToTime]);

  // DEBUG: Logowanie zmian w dziennych godzinach
  React.useEffect(() => {
    console.log("📝 DEBUG CreateMeeting: Zaktualizowane dzienne godziny", {
      dailyHoursCount: Object.keys(dailyHours).length,
      dailyHours: Object.entries(dailyHours).map(([date, hours]) => ({
        date: new Date(Number(date)).toLocaleDateString(),
        from: hours.from,
        to: hours.to,
        range: `${hours.from}:00 - ${hours.to}:00`,
      })),
      timestamp: new Date().toISOString(),
    });
  }, [dailyHours]);

  // DEBUG: Wrapper dla next z logowaniem
  const handleNext = () => {
    console.log("➡️ DEBUG CreateMeeting: Próba przejścia do następnego kroku", {
      currentStep: currStep,
      nextStep: currStep + 1,
      selectedDatesCount: selectedDates.length,
      hasErrors: Object.keys(errors).length > 0,
      errors,
      timestamp: new Date().toISOString(),
    });
    next();
  };

  // DEBUG: Wrapper dla prev z logowaniem
  const handlePrev = () => {
    console.log("⬅️ DEBUG CreateMeeting: Powrót do poprzedniego kroku", {
      currentStep: currStep,
      prevStep: currStep - 1,
      timestamp: new Date().toISOString(),
    });
    prev();
  };

  // DEBUG: Wrapper dla setSelectedDates z logowaniem
  const handleSetSelectedDates = (dates: number[]) => {
    console.log("📅 DEBUG CreateMeeting: Ręczne ustawienie dat", {
      oldDatesCount: selectedDates.length,
      newDatesCount: dates.length,
      oldDates: selectedDates.map((date) =>
        new Date(date).toLocaleDateString()
      ),
      newDates: dates.map((date) => new Date(date).toLocaleDateString()),
      addedDates: dates
        .filter((date) => !selectedDates.includes(date))
        .map((date) => new Date(date).toLocaleDateString()),
      removedDates: selectedDates
        .filter((date) => !dates.includes(date))
        .map((date) => new Date(date).toLocaleDateString()),
      timestamp: new Date().toISOString(),
    });
    setSelectedDates(dates);
  };

  if (isRequestInProgress) {
    console.log(
      "⏳ DEBUG CreateMeeting: Żądanie w toku - wyświetlanie loadera"
    );
    return <AnswerMeetingLoader />;
  }

  console.log("🔄 DEBUG CreateMeeting: Renderowanie komponentu", {
    currStep,
    selectedDatesCount: selectedDates.length,
    isRequestInProgress,
    timestamp: new Date().toISOString(),
  });

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
              setSelectedDates={handleSetSelectedDates}
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
          <Button
            text={dict.button.back}
            onClick={handlePrev}
            className="mr-10"
          />
          <Button
            text={`${
              currStep === 2
                ? dict.page.createMeeting.createButton
                : dict.button.next
            }`}
            onClick={handleNext}
          />
        </div>
      )}
    </main>
  );
}
