"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { api } from "../../../convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import _ from "lodash";
import moment from "moment";
import "moment/locale/pl";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMediaQuery } from "react-responsive";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import * as yup from "yup";

import Button from "@/components/Button";
import CopyLinkButton from "@/components/CopyLinkButton";
import Heading from "@/components/Heading";
import Input from "@/components/Input";
import { LinkButton } from "@/components/LinkButton";
import Title from "@/components/Title";

import { getAvailabilityInfo } from "@/utils/meeting/answer/getAvailabilityInfo";
import { getUnavailableUsersInfo } from "@/utils/meeting/answer/getUnavailableUsersInfo";
import useMouseDown from "@/utils/useIsMouseDown";
import { Locale } from "@root/i18n.config";

class MeetingDate {
  meetDate: number;
  isOnline: boolean;
  constructor(meetDate: number, isOnline: boolean) {
    this.meetDate = meetDate;
    this.isOnline = isOnline;
  }
}

export default function AnswerMeeting({
  lang,
  dict,
  meetingData,
}: {
  lang: Locale;
  dict: any;
  meetingData: any;
}) {
  moment.locale(lang);
  const pathname = usePathname();
  const addAnswer = useMutation(api.meetings.addAnswer);

  const liveData = useQuery(api.meetings.getByAppointmentId, {
    appointmentId: meetingData.appointmentId,
  });
  const currentMeeting = liveData ?? meetingData;

  const staticMeetingData = useMemo(
    () => ({
      meetName: currentMeeting.meetName,
      appointmentId: currentMeeting.appointmentId,
      meetPlace: currentMeeting.meetPlace,
      meetLink: currentMeeting.meetLink,
      dates:
        currentMeeting.dates
          ?.slice()
          .sort((a: any, b: any) => a.date - b.date) ?? [],
    }),
    [currentMeeting],
  );

  const flatTimes = useMemo(
    () => staticMeetingData.dates.flatMap((d: any) => d.times as number[]),
    [staticMeetingData.dates],
  );

  const timeRange = useMemo(() => {
    if (flatTimes.length === 0) return null;

    const dailyMinMax = staticMeetingData.dates.map((dateObj: any) => {
      const times: number[] = dateObj.times ?? [];
      const minTime = Math.min(...times);
      const maxTime = Math.max(...times);
      return {
        date: dateObj.date,
        minHour: moment(minTime).hour(),
        minMinute: moment(minTime).minute(),
        maxHour: moment(maxTime).hour(),
        maxMinute: moment(maxTime).minute(),
        dayMinTime: minTime,
        dayMaxTime: maxTime,
      };
    });

    const globalMinHour = Math.min(...dailyMinMax.map((d: any) => d.minHour));
    const globalMaxHour = Math.max(...dailyMinMax.map((d: any) => d.maxHour));

    const daysWithMinHour = dailyMinMax.filter(
      (d: any) => d.minHour === globalMinHour,
    );
    const daysWithMaxHour = dailyMinMax.filter(
      (d: any) => d.maxHour === globalMaxHour,
    );
    const globalMinMinute = Math.min(
      ...daysWithMinHour.map((d: any) => d.minMinute),
    );
    const globalMaxMinute = Math.max(
      ...daysWithMaxHour.map((d: any) => d.maxMinute),
    );

    const dayWithMin = daysWithMinHour.find(
      (d: any) => d.minMinute === globalMinMinute,
    );
    const dayWithMax = daysWithMaxHour.find(
      (d: any) => d.maxMinute === globalMaxMinute,
    );

    return {
      minTime: dayWithMin?.dayMinTime ?? Math.min(...flatTimes),
      maxTime: dayWithMax?.dayMaxTime ?? Math.max(...flatTimes),
      minimumTimeHour: globalMinHour,
      maximumTimeHour: globalMaxHour,
      isMinimumTimeHalfHour: globalMinMinute === 30,
      isMaximumTimeHalfHour: globalMaxMinute === 30,
    };
  }, [flatTimes, staticMeetingData.dates]);

  const answers: any[] = currentMeeting.answers ?? [];
  const [meetName, setMeetName] = useState(staticMeetingData.meetName);

  useEffect(() => {
    setMeetName(currentMeeting.meetName);
  }, [currentMeeting.meetName]);

  const [selectedTimecells, setSelectedTimecells] = useState<MeetingDate[]>([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const [lookedUpDatetime, setLookedUpDatetime] = useState<number>();
  const [lookedUpDate, setLookedUpDate] = useState<string>();
  const [lookedUpTime, setLookedUpTime] = useState<string>();
  const [mobileAnsweringMode, setMobileAnsweringMode] = useState(true);
  const [onlineSelectionMode, setOnlineSelectionMode] = useState(false);
  const [unselectMode, setUnselectMode] = useState(false);
  const [isSendingReq, setIsSendingReq] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [answerSent, setAnswerSent] = useState(false);
  const [username, setUsername] = useState("");
  const [availableCount, setAvailableCount] = useState(0);

  const isMobile = useMediaQuery({ query: "(max-width: 1023px)" });
  const isMouseDown = useMouseDown();

  const availabilityInfo = useMemo(
    () => getAvailabilityInfo(answers),
    [answers],
  );

  const highestAvailableCount = useMemo(() => {
    const counts = Object.values(availabilityInfo).map(
      (info: any) => info.usersInfo.length,
    );
    return counts.length > 0 ? Math.max(0, ...counts) : 0;
  }, [availabilityInfo]);

  const [toggleButtonName, setToggleButtonName] = useState(
    dict.page.answerMeeting.toggleButton.showAvailability,
  );

  const toggleAnsweringMode = useCallback(() => {
    setMobileAnsweringMode((prev) => !prev);
    setToggleButtonName((prev: any) =>
      prev === dict.page.answerMeeting.toggleButton.showAvailability
        ? dict.page.answerMeeting.toggleButton.answerMeeting
        : dict.page.answerMeeting.toggleButton.showAvailability,
    );
  }, [dict]);

  const isDateSelected = useCallback(
    (dateTime: number) =>
      selectedTimecells.some((m) => m.meetDate === dateTime),
    [selectedTimecells],
  );

  const getSelectedTimecell = useCallback(
    (dateTime: number) =>
      selectedTimecells.find((m) => m.meetDate === dateTime),
    [selectedTimecells],
  );

  const updateTimecell = useCallback((dateTime: number, isOnline: boolean) => {
    setSelectedTimecells((prev) =>
      prev.map((m) => (m.meetDate === dateTime ? { ...m, isOnline } : m)),
    );
  }, []);

  const unselectTimecell = useCallback(
    (dateTime: number) => {
      if (!isMobile) setUnselectMode(true);
      setSelectedTimecells((prev) =>
        prev.filter((m) => m.meetDate !== dateTime),
      );
    },
    [isMobile],
  );

  const toggleTimecell = useCallback(
    (dateTime: number) => {
      const isSelected = isDateSelected(dateTime);
      const cell = getSelectedTimecell(dateTime);

      if (isSelected) {
        if (!selectionMode) {
          if (cell?.isOnline) {
            unselectTimecell(dateTime);
            setOnlineSelectionMode(false);
          } else {
            setOnlineSelectionMode(true);
            updateTimecell(dateTime, true);
          }
        } else {
          if (!unselectMode) {
            if (onlineSelectionMode && !cell?.isOnline)
              updateTimecell(dateTime, true);
            else if (!onlineSelectionMode && cell?.isOnline)
              updateTimecell(dateTime, false);
          } else {
            unselectTimecell(dateTime);
          }
        }
      } else if (!unselectMode) {
        setSelectedTimecells((prev) => [
          ...prev,
          new MeetingDate(dateTime, onlineSelectionMode),
        ]);
      }
    },
    [
      isDateSelected,
      getSelectedTimecell,
      selectionMode,
      onlineSelectionMode,
      unselectMode,
      unselectTimecell,
      updateTimecell,
    ],
  );

  const disableSelection = useCallback(() => {
    if (!isMouseDown) {
      setSelectionMode(false);
      setUnselectMode(false);
      setOnlineSelectionMode(false);
    }
  }, [isMouseDown]);

  const convertDatetimeToDate = useCallback((datetime: number) => {
    const date = moment(datetime);
    setLookedUpDate(
      `${date.format("DD.MM")} ${_.capitalize(date.format("dddd"))}`,
    );
    setLookedUpTime(date.format("HH:mm"));
  }, []);

  const isAnswered = useCallback(
    (datetime: number) =>
      answers.some((a: any) =>
        a.dates.some((d: any) => d.meetDate === datetime),
      ),
    [answers],
  );

  const daysHeadings = useMemo(
    () =>
      staticMeetingData.dates.map((day: any) => {
        const d = moment(day.date);
        return (
          <th
            key={day.date}
            className={`bg-[#f0f4f8] sticky top-0 z-10 ${d.day() === 0 ? "pr-4" : ""}`}
          >
            <p className="text-sm text-dark font-medium">
              {`${d.date().toString().padStart(2, "0")}.${(d.month() + 1).toString().padStart(2, "0")}`}
            </p>
            <p className="text-dark">{_.capitalize(d.format("ddd"))}</p>
          </th>
        );
      }),
    [staticMeetingData.dates],
  );

  const availableTimecell = useCallback(
    (dateTime: number, isEndOfWeek: boolean) => {
      const isMobileAnsweringMode = isMobile && mobileAnsweringMode;
      const isDesktop = !isMobile;
      const cell = getSelectedTimecell(dateTime);
      const dateVotes = availabilityInfo[dateTime]?.usersInfo.length || 0;
      const isSelected = isDateSelected(dateTime);
      const isAnsweredDate = isAnswered(dateTime);

      const handleMouseDown = () => {
        if ((isMobileAnsweringMode || isDesktop) && !unselectMode) {
          toggleTimecell(dateTime);
        } else if (!isMobileAnsweringMode && !isDesktop && !unselectMode) {
          setLookedUpDatetime(dateTime);
          convertDatetimeToDate(dateTime);
        }
        if (isDesktop) setSelectionMode(true);
      };

      const handleMouseUp = () => {
        if (isDesktop) {
          setSelectionMode(false);
          setUnselectMode(false);
        }
      };

      const handleMouseOver = () => {
        if (selectionMode) toggleTimecell(dateTime);
        setLookedUpDatetime(dateTime);
        convertDatetimeToDate(dateTime);
        disableSelection();
      };

      return (
        <td key={dateTime}>
          <div
            data-date={dateTime}
            date-votes={dateVotes}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseOver={handleMouseOver}
            className={`rounded-lg h-12 w-24 lg:h-6 lg:w-12 transition-colors ${
              isEndOfWeek ? "mr-4" : ""
            } ${
              isAnsweredDate
                ? `border-none ${
                    isSelected
                      ? cell?.isOnline
                        ? `bg-gold ${!isMobile ? "hover:bg-gold/50" : ""}`
                        : `bg-primary ${!isMobile ? "hover:bg-primary/50" : ""}`
                      : `answered ${!isMobile ? "active:animate-cell-select" : ""} ${
                          availabilityInfo[dateTime].onlineCount >=
                            highestAvailableCount * 0.5 &&
                          availabilityInfo[dateTime].usersInfo.length ===
                            highestAvailableCount
                            ? `bg-gold-dark ${!isMobile ? "hover:bg-gold-dark/50" : ""}`
                            : availabilityInfo[dateTime].usersInfo.length ===
                                highestAvailableCount
                              ? `bg-green ${!isMobile ? "hover:bg-green/50" : ""}`
                              : `bg-light-green ${!isMobile ? "hover:bg-light-green/50" : ""}`
                        }`
                  }`
                : `border border-gray ${!isMobile ? "hover:border-gray/50" : ""} ${
                    isSelected
                      ? `border-none ${
                          cell?.isOnline
                            ? `bg-gold ${!isMobile ? "hover:bg-gold/50" : ""}`
                            : `bg-primary ${!isMobile ? "hover:bg-primary/50" : ""}`
                        }`
                      : `${
                          (isMobileAnsweringMode || isDesktop) &&
                          !isMobile &&
                          !unselectMode
                            ? "hover:border-none active:animate-cell-select hover:bg-primary"
                            : ""
                        }`
                  }`
            }`}
          />
        </td>
      );
    },
    [
      isMobile,
      mobileAnsweringMode,
      getSelectedTimecell,
      availabilityInfo,
      isDateSelected,
      isAnswered,
      unselectMode,
      selectionMode,
      toggleTimecell,
      convertDatetimeToDate,
      disableSelection,
      highestAvailableCount,
    ],
  );

  const timeCells = useMemo(() => {
    if (!timeRange) return [];

    const disabledTimecell = () => (
      <td>
        <div className="rounded-lg h-12 w-24 lg:h-6 lg:w-12 bg-light-gray cursor-default" />
      </td>
    );

    const cells: JSX.Element[] = [];

    for (
      let i = timeRange.minimumTimeHour;
      i <= timeRange.maximumTimeHour;
      i++
    ) {
      for (let h = 0; h < 2; h++) {
        const isHalfHour = h === 1;

        if (
          i === timeRange.maximumTimeHour &&
          isHalfHour &&
          !timeRange.isMaximumTimeHalfHour
        )
          break;
        if (
          i === timeRange.minimumTimeHour &&
          !isHalfHour &&
          timeRange.isMinimumTimeHalfHour
        )
          continue;

        const timeRow: JSX.Element[] = [];

        for (const date of staticMeetingData.dates) {
          const dateTime = moment(date.date)
            .hour(i)
            .minute(isHalfHour ? 30 : 0)
            .valueOf();
          const isEndOfWeek = moment(dateTime).day() === 0;
          const isTimeAvailable = flatTimes.includes(dateTime);

          timeRow.push(
            isTimeAvailable
              ? availableTimecell(dateTime, isEndOfWeek)
              : disabledTimecell(),
          );
        }

        const showLabel =
          (h === 0 &&
            !(
              i === timeRange.minimumTimeHour && timeRange.isMinimumTimeHalfHour
            )) ||
          (h === 1 &&
            i === timeRange.minimumTimeHour &&
            timeRange.isMinimumTimeHalfHour) ||
          (h === 1 &&
            i === timeRange.maximumTimeHour &&
            !timeRange.isMaximumTimeHalfHour);

        cells.push(
          <tr
            key={`${i}${isHalfHour ? "30" : "00"}`}
            className="cursor-pointer"
          >
            {showLabel && (
              <th
                rowSpan={isHalfHour ? 1 : 2}
                className="text-right text-dark align-top bg-[#f0f4f8] sticky left-0 pr-2"
              >
                {i === timeRange.minimumTimeHour &&
                timeRange.isMinimumTimeHalfHour
                  ? `${i.toString().padStart(2, "0")}:30`
                  : isHalfHour
                    ? `${i.toString().padStart(2, "0")}:30`
                    : `${i.toString().padStart(2, "0")}:00`}
              </th>
            )}
            {timeRow}
          </tr>,
        );
      }
    }

    if (timeRange.isMaximumTimeHalfHour) {
      const endHour = timeRange.maximumTimeHour + 1;
      cells.push(
        <tr key={`${endHour}00`} className="cursor-pointer">
          <th className="text-right text-dark align-bottom bg-[#f0f4f8] sticky left-0 pr-2">
            {`${endHour.toString().padStart(2, "0")}:00`}
          </th>
        </tr>,
      );
    }

    return cells;
  }, [
    timeRange,
    staticMeetingData.dates,
    flatTimes,
    availableTimecell,
    availabilityInfo,
    highestAvailableCount,
  ]);

  const sendAnswer: SubmitHandler<any> = useCallback(async () => {
    if (isSendingReq || !username) return;
    setSendError(null);
    setIsSendingReq(true);
    try {
      await addAnswer({
        appointmentId: staticMeetingData.appointmentId,
        username,
        dates: selectedTimecells.map((m) => ({
          meetDate: m.meetDate,
          isOnline: m.isOnline,
        })),
      });
      setUsername("");
      setSelectedTimecells([]);
      setAnswerSent(true);
      setTimeout(() => setAnswerSent(false), 4000);
    } catch (error: any) {
      const msg = error?.message || "";
      if (msg.includes("already answered")) {
        setSendError(dict.page.answerMeeting.error.alreadyAnswered);
      } else {
        setSendError(dict.page.answerMeeting.error.submitFailed);
      }
    } finally {
      setIsSendingReq(false);
    }
  }, [
    isSendingReq,
    username,
    selectedTimecells,
    staticMeetingData.appointmentId,
    addAnswer,
    dict,
  ]);

  useEffect(() => {
    if (lookedUpDatetime && availabilityInfo[lookedUpDatetime]) {
      setAvailableCount(availabilityInfo[lookedUpDatetime].usersInfo.length);
    } else {
      setAvailableCount(0);
    }
  }, [lookedUpDatetime, availabilityInfo]);

  const availabilityInfoContent = useMemo(() => {
    if (!lookedUpDatetime) {
      return isMobile ? (
        <span>{dict.page.answerMeeting.clickToReveal}</span>
      ) : (
        <span>{dict.page.answerMeeting.hoverToReveal}</span>
      );
    }

    if (!availabilityInfo[lookedUpDatetime]) {
      return (
        <span className="text-dark">
          {dict.page.answerMeeting.nobodyAvailable}
        </span>
      );
    }

    const dayInfo = availabilityInfo[lookedUpDatetime];
    const availableUsers = [...(dayInfo?.usersInfo ?? [])].sort(
      (a: any, b: any) =>
        a.userData.username.localeCompare(b.userData.username),
    );

    const onlineUsers = availableUsers.filter((u: any) => u.isOnline);
    const offlineUsers = availableUsers.filter((u: any) => !u.isOnline);
    const unavailableUsers = getUnavailableUsersInfo(answers, availableUsers);

    return (
      <ul>
        {onlineUsers.map((u: any) => (
          <li key={u.userData.userId} className="flex items-center">
            <span className="block h-3 w-3 rounded-full bg-gold mr-2" />
            <span>{u.userData.username}</span>
          </li>
        ))}
        {offlineUsers.map((u: any) => (
          <li key={u.userData.userId} className="flex items-center">
            <span className="block h-3 w-3 rounded-full bg-primary mr-2" />
            <span>{u.userData.username}</span>
          </li>
        ))}
        {unavailableUsers?.map((u: any) => (
          <li key={u._id} className="text-gray flex items-center">
            <span className="block h-3 w-3 rounded-full bg-gray mr-2" />
            <s>{u.username}</s>
          </li>
        ))}
      </ul>
    );
  }, [lookedUpDatetime, availabilityInfo, answers, isMobile, dict]);

  const formSchema = yup.object().shape({
    name: yup
      .string()
      .required(dict.page.answerMeeting.validate.name.required)
      .max(20, dict.page.answerMeeting.validate.name.max),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(formSchema) });

  return (
    <main className="flex md:flex-1 flex-col px-5 py-10 pt-24 lg:p-24 lg:pt-28 h-smd:pt-30 lg:m-0 w-[356px] md:w-auto lg:w-[900px]">
      <Title text={meetName} />
      {(staticMeetingData.meetPlace || staticMeetingData.meetLink) && (
        <div className="mb-10">
          {staticMeetingData.meetPlace && (
            <p className="text-dark">🏢 {staticMeetingData.meetPlace}</p>
          )}
          {staticMeetingData.meetLink && (
            <p>
              🔗{" "}
              <LinkButton
                href={staticMeetingData.meetLink}
                text="Link do spotkania"
              />
            </p>
          )}
        </div>
      )}

      <div className="flex flex-1 lg:flex-none items-center lg:items-start flex-col-reverse justify-end lg:justify-start lg:flex-row">
        {(!mobileAnsweringMode && isMobile) || !isMobile ? (
          <section className="availability__info w-full lg:w-1/2 lg:mr-10">
            <p className="text-sm text-gray mb-3">
              {answers.length} {dict.page.answerMeeting.responseCount}
            </p>
            {answers.length === 0 && !lookedUpDate ? (
              <p className="text-dark italic text-sm mb-3">
                {dict.page.answerMeeting.firstToAnswer}
              </p>
            ) : (
              <>
                <p className="text-dark">
                  {lookedUpDate} {lookedUpTime}
                </p>
                {lookedUpDate && (
                  <Heading text={`${availableCount}/${answers.length}`} />
                )}
              </>
            )}
            <div
              className={`overflow-auto ${isMobile ? "max-h-[100px]" : ""} h-hd:max-h-[300px]`}
            >
              {availabilityInfoContent}
            </div>
          </section>
        ) : null}

        <section className="flex flex-col time__selection lg:w-1/2">
          {isMobile && (
            <div className="flex items-center justify-center mb-5">
              <Button text={toggleButtonName} onClick={toggleAnsweringMode} />
            </div>
          )}

          <form
            className="flex flex-1 flex-col place-content-start items-center"
            onSubmit={handleSubmit(sendAnswer)}
          >
            <div className="flex flex-col-reverse lg:flex-col items-center lg:items-start w-full">
              {(mobileAnsweringMode && isMobile) || !isMobile ? (
                <div className="w-full max-w-[365px] md:max-w-[500px]">
                  <Input
                    label={dict.page.answerMeeting.input.name.label}
                    type="text"
                    id="name"
                    register={register}
                    error={!!errors.name}
                    errorText={errors.name?.message?.toString()}
                    onChange={(e) => setUsername(e.target.value)}
                    value={username}
                    placeholder={dict.page.answerMeeting.input.name.placeholder}
                    name="name"
                    autocomplete="name"
                  />
                </div>
              ) : null}

              <div
                className={`self-center overflow-auto max-h-[300px] h-md:max-h-[350px] h-mdl:max-h-[400px] h-hd:max-h-[400px] md:h-lg:max-h-[600px] lg:max-h-[300px] w-auto max-w-[365px] md:max-w-[700px] lg:max-w-[350px] pr-3 mt-5 ${
                  isMobile ? "mb-10" : ""
                }`}
              >
                <table className="time__seclection--table w-fit lg:mt-5 self-center select-none">
                  <thead>
                    <tr>
                      <th className="bg-[#f0f4f8] sticky top-0 left-0 z-20" />
                      {daysHeadings}
                    </tr>
                  </thead>
                  <tbody>{timeCells}</tbody>
                </table>
              </div>
            </div>

            {(mobileAnsweringMode && isMobile) || !isMobile ? (
              <div className="flex flex-col items-center mt-6 w-full">
                {answerSent && (
                  <p className="text-green font-medium text-sm mb-4 text-center animate-fade-in">
                    ✓ {dict.page.answerMeeting.success}
                  </p>
                )}
                {sendError && (
                  <p className="text-red-500 text-sm mb-4 text-center">
                    {sendError}
                  </p>
                )}

                <div className="flex flex-row items-center justify-center gap-4 flex-wrap w-full max-w-[500px]">
                  <div>
                    <Popup
                      trigger={
                        <button
                          type="button"
                          className="bg-white hover:bg-gray/5 active:bg-gray/10 border border-gray/10 shadow-sm text-dark font-bold h-[46px] w-[46px] rounded-full transition-all duration-200 flex items-center justify-center"
                        >
                          ?
                        </button>
                      }
                      modal
                      nested
                      closeOnDocumentClick
                    >
                      <div className="p-4 md:p-6 text-dark max-w-[400px]">
                        <p className="mb-4 text-sm leading-relaxed">
                          {dict.page.answerMeeting.help_popup.line1.segment1}
                          <span className="font-semibold text-primary">
                            {dict.page.answerMeeting.help_popup.line1.segment2}
                          </span>
                          {dict.page.answerMeeting.help_popup.line1.segment3}
                        </p>
                        <p className="mb-6 pb-4 border-b border-gray/10 text-sm leading-relaxed text-gray">
                          {dict.page.answerMeeting.help_popup.line2}
                        </p>

                        <div className="space-y-4">
                          <div>
                            <p className="font-semibold mb-3 text-sm uppercase tracking-wide text-gray/80">
                              {
                                dict.page.answerMeeting.help_popup.showMode
                                  .title
                              }
                            </p>
                            <div className="flex flex-col gap-2.5">
                              <p className="flex items-center text-sm">
                                <span className="block h-4 w-4 rounded-full bg-primary/20 border-2 border-primary mr-3 shadow-sm" />
                                {
                                  dict.page.answerMeeting.help_popup.showMode
                                    .green
                                }
                              </p>
                              <p className="flex items-center text-sm">
                                <span className="block h-4 w-4 rounded-full bg-gold/20 border-2 border-gold mr-3 shadow-sm" />
                                {
                                  dict.page.answerMeeting.help_popup.showMode
                                    .gold
                                }
                              </p>
                            </div>
                          </div>

                          <div className="pt-4 border-t border-gray/10">
                            <p className="font-semibold mb-3 text-sm uppercase tracking-wide text-gray/80">
                              {
                                dict.page.answerMeeting.help_popup.answerMode
                                  .title
                              }
                            </p>
                            <div className="flex flex-col gap-2.5">
                              <p className="flex items-center text-sm">
                                <span className="block h-4 w-4 rounded-full bg-green border-2 border-green mr-3 shadow-sm" />
                                {
                                  dict.page.answerMeeting.help_popup.answerMode
                                    .green
                                }
                              </p>
                              <p className="flex items-center text-sm">
                                <span className="block h-4 w-4 rounded-full bg-gold-dark border-2 border-gold mr-3 shadow-sm" />
                                {
                                  dict.page.answerMeeting.help_popup.answerMode
                                    .gold
                                }
                              </p>
                              <p className="flex items-center text-sm text-gray">
                                <span className="block h-4 w-4 rounded-full bg-light-green border border-gray/20 mr-3 shadow-sm opacity-60" />
                                {
                                  dict.page.answerMeeting.help_popup.answerMode
                                    .lightGreen
                                }
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Popup>
                  </div>
                  <Button
                    text={
                      isSendingReq
                        ? "..."
                        : dict.page.answerMeeting.button.submit
                    }
                    type="submit"
                    disabled={isSendingReq}
                    className="m-0"
                  />
                  <CopyLinkButton link={pathname} dict={dict} className="m-0" />
                </div>
              </div>
            ) : null}
          </form>
        </section>
      </div>
    </main>
  );
}
