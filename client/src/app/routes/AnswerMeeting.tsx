"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import _ from "lodash";
import moment from "moment";
import "moment/locale/pl";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMediaQuery } from "react-responsive";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import * as yup from "yup";

// Components
import Button from "@/components/Button";
import CopyLinkButton from "@/components/CopyLinkButton";
import Heading from "@/components/Heading";
import Input from "@/components/Input";
import { LinkButton } from "@/components/LinkButton";
import Title from "@/components/Title";

// Utils
import { getAvailabilityInfo } from "@/utils/meeting/answer/getAvailabilityInfo";
import { getUnavailableUsersInfo } from "@/utils/meeting/answer/getUnavailableUsersInfo";
import useMouseDown from "@/utils/useIsMouseDown";
import { Locale } from "@root/i18n.config";
export default function AnswerMeeting({
  lang,
  dict,
  meetingData,
  session,
}: {
  lang: Locale;
  dict: any;
  meetingData: any;
  session: any;
}) {
  moment.locale(lang);
  const pathname = usePathname();

  React.useEffect(() => {
    console.log("🚀 DEBUG AnswerMeeting: Inicjalizacja komponentu", {
      meetingData: {
        meetName: meetingData.meetName,
        appointmentId: meetingData.appointmentId,
        meetPlace: meetingData.meetPlace,
        meetLink: meetingData.meetLink,
        datesCount: meetingData.dates?.length || 0,
        answersCount: meetingData.answers?.length || 0,
        answers: meetingData.answers || 0,
        dates: meetingData.dates || 0,
      },
      session: session
        ? {
            isLoggedIn: true,
            username: session.user?.name,
          }
        : { isLoggedIn: false },
      lang,
      pathname,
      timestamp: new Date().toISOString(),
    });
  }, []);

  const [selectedTimecells, setSelectedTimecells] = useState<MeetingDate[]>([]);

  class MeetingDate {
    meetDate: number;
    isOnline: boolean;

    constructor(meetDate: number, isOnline: boolean) {
      this.meetDate = meetDate;
      this.isOnline = isOnline;
    }
  }

  // Auth
  const isUserLoggedIn = !!session?.user;
  const [selectionMode, setSelectionMode] = useState(false);
  const [lookedUpDatetime, setLookedUpDatetime] = useState<number>();
  const [lookedUpDate, setLookedUpDate] = useState<string>();
  const [lookedUpTime, setLookedUpTime] = useState<string>();
  const [username, setUsername] = useState(
    isUserLoggedIn ? session.user.name : ""
  );
  const [availableCount, setAvailableCount] = useState(0);
  const [answers, setAnswers] = useState<any>(meetingData.answers);
  const [meetName, setMeetName] = useState(meetingData.meetName);
  const meetPlace = meetingData.meetPlace;
  const meetLink = meetingData.meetLink;
  const answersCount = answers.length;
  const datesInfo = meetingData.dates;
  const [highestAvailableCount, setHighestAvailableCount] = useState(0);
  const [mobileAnsweringMode, setMobileAnsweringMode] = useState(true);
  const currentUrl = pathname;

  // Checking mobile mode
  const isMobile = useMediaQuery({
    query: "(max-width: 1023px)",
  });

  // Handling mouse down
  const isMouseDown = useMouseDown();

  const availabilityInfo = getAvailabilityInfo(answers);

  const [toggleButtonName, setToggleButtonName] = useState(
    dict.page.answerMeeting.toggleButton.showAvailability
  );
  const toggleAnsweringMode = () => {
    setMobileAnsweringMode((prevMode) => !prevMode);
    if (mobileAnsweringMode)
      setToggleButtonName(dict.page.answerMeeting.toggleButton.answerMeeting);
    else
      setToggleButtonName(
        dict.page.answerMeeting.toggleButton.showAvailability
      );
  };

  // Answering functionallity
  const dates = meetingData.dates.sort();

  const isDateSelected = (dateTime: number) =>
    selectedTimecells.some(
      (meetDateInfo) => meetDateInfo.meetDate === dateTime
    );

  const getSelectedTimecell = (dateTime: number) =>
    selectedTimecells.find(
      (meetDateInfo) => meetDateInfo.meetDate === dateTime
    );

  const updateTimecell = (dateTime: number, isOnline: boolean) => {
    setSelectedTimecells((prevTimecells) => {
      const updatedTimecells = prevTimecells.map((meetDateInfo) =>
        meetDateInfo.meetDate === dateTime
          ? { ...meetDateInfo, isOnline }
          : meetDateInfo
      );
      return updatedTimecells;
    });
  };

  const unselectTimecell = (dateTime: number) => {
    if (!isMobile) {
      setUnselectMode(true);
    }
    setSelectedTimecells(
      selectedTimecells.filter(
        (meetDateInfo) => meetDateInfo.meetDate !== dateTime
      )
    );
  };

  const [onlineSelectionMode, setOnlineSelectionMode] = useState(false);
  const [unselectMode, setUnselectMode] = useState(false);

  const toggleTimecell = (dateTime: number) => {
    const isSelected = isDateSelected(dateTime);
    const selectedTimecell = getSelectedTimecell(dateTime);

    console.log("toggleTimecell", {
      isSelected,
      selectedTimecell,
      selectionMode,
      onlineSelectionMode,
      unselectMode,
    });

    if (isSelected) {
      if (!selectionMode) {
        if (selectedTimecell?.isOnline) {
          // Selecting timecell online -> unselected (click)
          unselectTimecell(dateTime);
          setOnlineSelectionMode(false);
        } else if (!selectedTimecell?.isOnline) {
          // Selecting timecell offline -> online (click)
          setOnlineSelectionMode(true);
          updateTimecell(dateTime, true);
        }
      } else {
        if (!unselectMode) {
          if (onlineSelectionMode && !selectedTimecell?.isOnline) {
            // Updating timecell offline -> online (drag)
            updateTimecell(dateTime, true);
          } else if (!onlineSelectionMode && selectedTimecell?.isOnline) {
            // Updating timecell online -> offline (drag)
            updateTimecell(dateTime, false);
          }
        } else {
          // Updating timecell online -> unselected (drag)
          unselectTimecell(dateTime);
        }
      }
    } else if (!unselectMode) {
      // Selecting timecell unselected -> offline (click)
      const meetDateInfo = new MeetingDate(dateTime, onlineSelectionMode);
      setSelectedTimecells([...selectedTimecells, meetDateInfo]);
    }
  };

  const disableSelection = () => {
    if (!isMouseDown) {
      setSelectionMode(false);
      setUnselectMode(false);
      setOnlineSelectionMode(false);
    }
  };

  // Table rendering
  const convertDatetimeToDate = (datetime: number) => {
    const date = moment(datetime);
    const convertedDate = date.format("DD.MM");
    const convertedDayName = _.capitalize(date.format("dddd"));
    const convertedTime = date.format("HH:mm");
    setLookedUpDate(`${convertedDate} ${convertedDayName}`);
    setLookedUpTime(convertedTime);

    console.log("👀 DEBUG AnswerMeeting: Podgląd daty/czasu", {
      datetime,
      convertedDate,
      convertedDayName,
      convertedTime,
      formattedDateTime: `${convertedDate} ${convertedDayName} ${convertedTime}`,
      timestamp: new Date().toISOString(),
    });
  };

  const flatTimes: number[] = datesInfo.flatMap((date: any) => date.times);

  // DEBUG: Logowanie analizy wszystkich czasów
  React.useEffect(() => {
    console.log("🕐 DEBUG AnswerMeeting: Analiza wszystkich czasów", {
      totalTimesCount: flatTimes.length,
      datesInfoCount: datesInfo.length,
      datesBreakdown: datesInfo.map((date: any, index: number) => ({
        dayIndex: index,
        date: new Date(date.date).toLocaleDateString(),
        timesCount: date.times?.length || 0,
        firstTime: date.times?.[0]
          ? new Date(date.times[0]).toLocaleString()
          : null,
        lastTime: date.times?.[date.times.length - 1]
          ? new Date(date.times[date.times.length - 1]).toLocaleString()
          : null,
        hourRange:
          date.times?.length > 0
            ? {
                firstHour: moment(Math.min(...date.times)).hour(),
                firstMinute: moment(Math.min(...date.times)).minute(),
                lastHour: moment(Math.max(...date.times)).hour(),
                lastMinute: moment(Math.max(...date.times)).minute(),
              }
            : null,
      })),
      globalTimeRange: {
        earliest:
          flatTimes.length > 0
            ? new Date(Math.min(...flatTimes)).toLocaleString()
            : null,
        latest:
          flatTimes.length > 0
            ? new Date(Math.max(...flatTimes)).toLocaleString()
            : null,
        earliestHour:
          flatTimes.length > 0 ? moment(Math.min(...flatTimes)).hour() : null,
        latestHour:
          flatTimes.length > 0 ? moment(Math.max(...flatTimes)).hour() : null,
      },
      timestamp: new Date().toISOString(),
    });
  }, [flatTimes, datesInfo]);

  const getMinimumTimeInDates = (): moment.Moment => {
    const minTime = Math.min(...flatTimes);
    console.log("⏰ DEBUG AnswerMeeting: Najwcześniejszy czas", {
      minTimeRaw: minTime,
      minTimeFormatted: new Date(minTime).toLocaleString(),
      hour: moment(minTime).hour(),
      minute: moment(minTime).minute(),
      timestamp: new Date().toISOString(),
    });
    return moment(minTime);
  };

  const getMaximumTimeInDates = (): moment.Moment => {
    const maxTime = Math.max(...flatTimes);
    console.log("⏰ DEBUG AnswerMeeting: Najpóźniejszy czas", {
      maxTimeRaw: maxTime,
      maxTimeFormatted: new Date(maxTime).toLocaleString(),
      hour: moment(maxTime).hour(),
      minute: moment(maxTime).minute(),
      timestamp: new Date().toISOString(),
    });
    return moment(maxTime);
  };

  const isMinimumTimeHalfHour = (): boolean => {
    const result = getMinimumTimeInDates().minute() === 30;
    console.log(
      "🕐 DEBUG AnswerMeeting: Czy najwcześniejszy czas to półgodzina?",
      {
        result,
        minute: getMinimumTimeInDates().minute(),
        timestamp: new Date().toISOString(),
      }
    );
    return result;
  };

  const isMaximumTimeHalfHour = (): boolean => {
    const result = getMaximumTimeInDates().minute() === 30;
    console.log(
      "🕐 DEBUG AnswerMeeting: Czy najpóźniejszy czas to półgodzina?",
      {
        result,
        minute: getMaximumTimeInDates().minute(),
        timestamp: new Date().toISOString(),
      }
    );
    return result;
  };

  const renderTimeCells = () => {
    const disabledTimecell = () => (
      <td>
        <div className="rounded-lg h-12 w-24 lg:h-6 lg:w-12 bg-light-gray cursor-default"></div>
      </td>
    );

    // POPRAWKA: Używamy globalnego minimum i maximum zamiast pierwszego dnia
    const minimumTimeHour = getMinimumTimeInDates().hour();
    const maximumTimeHour = getMaximumTimeInDates().hour();

    console.log("📊 DEBUG AnswerMeeting: Renderowanie komórek czasowych", {
      minimumTimeHour,
      maximumTimeHour,
      isMinimumHalfHour: isMinimumTimeHalfHour(),
      isMaximumHalfHour: isMaximumTimeHalfHour(),
      hourRange: `${minimumTimeHour}:00 - ${maximumTimeHour}:00`,
      totalHoursSpan: maximumTimeHour - minimumTimeHour + 1,
      datesCount: dates.length,
      timestamp: new Date().toISOString(),
    });

    var timeCells: JSX.Element[] = [];

    for (let i = minimumTimeHour; i <= maximumTimeHour; i++) {
      for (let h = 0; h < 2; h++) {
        // Handle half hours
        const isHalfHour = h === 1;

        // POPRAWKA: Sprawdzamy warunki na podstawie globalnych minimum i maximum
        if (i == maximumTimeHour && isHalfHour && !isMaximumTimeHalfHour()) {
          console.log("⏭️ DEBUG: Pomijanie ostatniej półgodziny", {
            hour: i,
            isHalfHour,
            reason: "Maksymalny czas nie jest półgodziną",
          });
          break;
        }

        if (i == minimumTimeHour && !isHalfHour && isMinimumTimeHalfHour()) {
          console.log("⏭️ DEBUG: Pomijanie pierwszej pełnej godziny", {
            hour: i,
            isHalfHour,
            reason: "Minimalny czas zaczyna się od półgodziny",
          });
          continue;
        }

        let timeRow: JSX.Element[] = [];
        let validTimesInRow = 0;

        for (const date of dates) {
          const dateTime = moment(date.date)
            .hour(i)
            .minute(isHalfHour ? 30 : 0)
            .valueOf();

          const isEndOfWeek = moment(dateTime).day() == 0;
          const isTimeAvailable = flatTimes.includes(dateTime);

          if (isTimeAvailable) {
            validTimesInRow++;
          }

          const cellComponent = isTimeAvailable
            ? availableTimecell(dateTime, isEndOfWeek)
            : disabledTimecell();
          timeRow.push(cellComponent);

          const usersInfoCount =
            availabilityInfo[dateTime]?.usersInfo.length || 0;
          if (usersInfoCount > highestAvailableCount) {
            setHighestAvailableCount(
              availabilityInfo[dateTime].usersInfo.length
            );
          }
        }

        console.log("📋 DEBUG AnswerMeeting: Wygenerowany rząd czasu", {
          hour: i,
          minute: isHalfHour ? 30 : 0,
          timeDisplay: `${i.toString().padStart(2, "0")}:${
            isHalfHour ? "30" : "00"
          }`,
          validTimesInRow,
          totalCellsInRow: timeRow.length,
          timestamp: new Date().toISOString(),
        });

        timeCells.push(
          <tr
            key={`${i}${isHalfHour ? "30" : "00"}`}
            className="cursor-pointer"
          >
            {((h === 0 &&
              !(i === minimumTimeHour && isMinimumTimeHalfHour())) ||
              (h === 1 && i === minimumTimeHour && isMinimumTimeHalfHour()) ||
              (h === 1 &&
                i === maximumTimeHour &&
                !isMaximumTimeHalfHour())) && (
              <th
                rowSpan={isHalfHour ? 1 : 2}
                className="text-right text-dark align-top bg-light sticky left-0 pr-2"
              >
                {i === minimumTimeHour && isMinimumTimeHalfHour()
                  ? `${i.toString().padStart(2, "0")}:30`
                  : isHalfHour
                  ? `${i.toString().padStart(2, "0")}:30`
                  : `${i.toString().padStart(2, "0")}:00`}
              </th>
            )}
            {timeRow}
          </tr>
        );
      }
    }

    // Add end hour row only if maximum time is half hour
    if (isMaximumTimeHalfHour()) {
      const endHour = maximumTimeHour + 1;
      const endMinute = "00";
      const key = `${endHour}${endMinute}`;

      console.log("🔚 DEBUG AnswerMeeting: Dodawanie końcowego rzędu godziny", {
        endHour,
        endMinute,
        key,
        reason: "Maksymalny czas jest półgodziną",
        timestamp: new Date().toISOString(),
      });

      timeCells.push(
        <tr key={key} className="cursor-pointer">
          <th className="text-right text-dark align-bottom bg-light sticky left-0 pr-2">
            {`${endHour.toString().padStart(2, "0")}:${endMinute}`}
          </th>
        </tr>
      );
    }

    console.log("✅ DEBUG AnswerMeeting: Zakończono renderowanie tabeli", {
      totalRows: timeCells.length,
      hourRange: `${minimumTimeHour}:${
        isMinimumTimeHalfHour() ? "30" : "00"
      } - ${maximumTimeHour}:${isMaximumTimeHalfHour() ? "30" : "00"}`,
      timestamp: new Date().toISOString(),
    });

    return timeCells;
  };

  const availableTimecell = (dateTime: number, isEndOfWeek: boolean) => {
    const isMobileAnsweringMode = isMobile && mobileAnsweringMode;
    const isDesktop = !isMobile;
    const selectedTimecell = getSelectedTimecell(dateTime);
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
      if (isDesktop) {
        setSelectionMode(true);
      }
    };

    const handleMouseUp = () => {
      if (isDesktop) {
        setSelectionMode(false);
        setUnselectMode(false);
      }
    };

    const handleMouseOver = () => {
      if (selectionMode) {
        toggleTimecell(dateTime);
      }
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
            isEndOfWeek && "mr-4"
          } ${
            isAnsweredDate
              ? `border-none ${
                  isSelected
                    ? `${
                        selectedTimecell?.isOnline
                          ? `bg-gold ${!isMobile && "hover:bg-gold/50"}`
                          : `bg-primary ${!isMobile && "hover:bg-primary/50"}`
                      } selected`
                    : `answered  ${!isMobile && "active:animate-cell-select"} ${
                        availabilityInfo[dateTime].onlineCount >=
                          highestAvailableCount * 0.5 &&
                        availabilityInfo[dateTime].usersInfo.length ==
                          highestAvailableCount
                          ? `bg-gold-dark ${
                              !isMobile && "hover:bg-gold-dark/50"
                            }`
                          : availabilityInfo[dateTime].usersInfo.length ==
                            highestAvailableCount
                          ? `bg-green ${!isMobile && "hover:bg-green/50"}`
                          : `bg-light-green ${
                              !isMobile && "hover:bg-light-green/50"
                            }`
                      }`
                }`
              : `border border-gray ${!isMobile && "hover:border-gray/50"} ${
                  isSelected
                    ? `border-none ${
                        selectedTimecell?.isOnline
                          ? `bg-gold ${!isMobile && "hover:bg-gold/50"}`
                          : `bg-primary ${!isMobile && "hover:bg-primary/50"}`
                      }`
                    : `${
                        (isMobileAnsweringMode || isDesktop) &&
                        !isMobile &&
                        !unselectMode &&
                        "hover:border-none active:animate-cell-select hover:bg-primary"
                      }`
                }`
          }`}
        ></div>
      </td>
    );
  };

  const isAnswered = (datetime: number) =>
    answers.some((answer: any) =>
      answer.dates.some((date: any) => date.meetDate === datetime)
    );

  const renderDaysHeadings = () => {
    const daysHeadings = dates.map((day: any) => {
      const dateMoment = moment(day.date);
      const date = dateMoment.date();
      const month = dateMoment.month() + 1;
      const dayOfWeek = dateMoment.day();
      const classNames = dayOfWeek === 0 ? "pr-4" : "";

      return (
        <th
          key={day.date}
          className={`bg-light sticky top-0 z-10 ${classNames}`}
        >
          <p className="text-sm text-dark font-medium">
            {`${date.toString().padStart(2, "0")}.${month
              .toString()
              .padStart(2, "0")}`}
          </p>
          <p className="text-dark">{_.capitalize(dateMoment.format("ddd"))}</p>
        </th>
      );
    });

    return daysHeadings;
  };

  const renderAvailabilityInfo = () => {
    if (lookedUpDatetime) {
      if (!availabilityInfo[lookedUpDatetime]) {
        return (
          <span className="text-dark">
            {dict.page.answerMeeting.nobodyAvailable}
          </span>
        );
      } else {
        const dayAvailabilityInfo = availabilityInfo[lookedUpDatetime];
        const availableUsers = dayAvailabilityInfo?.usersInfo;

        // Sort avaulable users by username alphabetically
        availableUsers?.sort((a: any, b: any) =>
          a.userData.username.localeCompare(b.userData.username)
        );

        const onlineAvailableUsers = availableUsers?.filter(
          (user: any) => user.isOnline === true
        );

        const listOfOnlineAvailableUsers = onlineAvailableUsers?.map(
          (userData: any) => (
            <li key={userData.userData.userId} className="flex items-center">
              <span className="block h-3 w-3 rounded-full bg-gold mr-2"></span>
              <span>{userData.userData.username}</span>
            </li>
          )
        );

        const offlineAvailableUsers = availableUsers?.filter(
          (user: any) => user.isOnline === false
        );

        const listOfOfflineAvailableUsers = offlineAvailableUsers?.map(
          (userData: any) => (
            <li key={userData.userData.userId} className="flex items-center">
              <span className="block h-3 w-3 rounded-full bg-primary mr-2"></span>
              <span>{userData.userData.username}</span>
            </li>
          )
        );

        const unavailableUsers = getUnavailableUsersInfo(
          answers,
          availableUsers
        );

        const listOfUnavailableUsers = unavailableUsers?.map(
          (userData: any) => (
            <li key={userData._id} className="text-gray flex items-center">
              <span className="block h-3 w-3 rounded-full bg-gray mr-2"></span>
              <s>{userData.username}</s>
            </li>
          )
        );

        const listOfAvailability = (
          <ul>
            {listOfOnlineAvailableUsers}
            {listOfOfflineAvailableUsers}
            {listOfUnavailableUsers}
          </ul>
        );

        const listOfUsernames = listOfAvailability;

        return listOfUsernames;
      }
    } else {
      if (isMobile) {
        return <span>{dict.page.answerMeeting.clickToReveal}</span>;
      }
      return <span>{dict.page.answerMeeting.hoverToReveal}</span>;
    }
  };

  function clearFormData() {
    setUsername("");
    setSelectedTimecells([]);
  }

  const [isSendingReq, setIsSendingReq] = useState(false);
  const sendAnswer: SubmitHandler<Inputs> = async () => {
    try {
      if (isSendingReq || !username) return;

      setIsSendingReq(true);

      const answerResponse = await axios.patch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/meet/${meetingData.appointmentId}`,
        { username, dates: selectedTimecells }
      );

      if (answerResponse.status !== 200) return;

      const updatedMeetResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/meet/${meetingData.appointmentId}`
      );

      if (updatedMeetResponse.status === 200) {
        setAnswers(updatedMeetResponse.data.answers);
        setMeetName(updatedMeetResponse.data.meetName);
        clearFormData();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSendingReq(false);
    }
  };

  const sendAnswerLoggedIn = async () => {
    try {
      if (isSendingReq) return;

      setIsSendingReq(true);

      const answerResponse = await axios.patch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/meet/${meetingData.appointmentId}`,
        { username, dates: selectedTimecells }
      );

      if (answerResponse.status !== 200) return;

      const updatedMeetResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/meet/${meetingData.appointmentId}`
      );

      if (updatedMeetResponse.status === 200) {
        setAnswers(updatedMeetResponse.data.answers);
        setMeetName(updatedMeetResponse.data.meetName);
        setSelectedTimecells([]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSendingReq(false);
    }
  };

  useEffect(() => {
    if (lookedUpDatetime && availabilityInfo[lookedUpDatetime]) {
      setAvailableCount(availabilityInfo[lookedUpDatetime].usersInfo.length);
    } else {
      setAvailableCount(0);
    }
  }, [lookedUpDatetime, availabilityInfo]);

  // Forms
  const formSchema = yup.object().shape({
    name: yup
      .string()
      .required(dict.page.answerMeeting.validate.name.required)
      .max(20, dict.page.answerMeeting.validate.name.max),
  });

  type Inputs = {
    name: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: yupResolver(formSchema),
  });

  return (
    <main className="flex md:flex-1 flex-col px-5 py-10 pt-24 lg:p-24 lg:pt-28 h-smd:pt-30 lg:m-0 w-[356px] md:w-auto lg:w-[900px]">
      <Title text={meetName} />
      {/* Meeting details */}
      {(meetPlace || meetLink) && (
        <div className="mb-10">
          {meetPlace && <p className="text-dark">🏢 {meetPlace}</p>}
          {meetLink && (
            <p>
              🔗 <LinkButton href={meetLink} text="Link do spotkania" />
            </p>
          )}
        </div>
      )}

      {/* Meeting data */}
      <div className="flex flex-1 lg:flex-none items-center lg:items-start flex-col-reverse justify-end lg:justify-start lg:flex-row">
        {(!mobileAnsweringMode && isMobile) || !isMobile ? (
          <section className="availability__info w-full lg:w-1/2 lg:mr-10">
            <p className="text-dark">
              {lookedUpDate} {lookedUpTime}
            </p>
            {lookedUpDate && (
              <Heading text={`${availableCount}/${answersCount}`} />
            )}
            <div
              className={`overflow-auto ${
                isMobile && "max-h-[100px]"
              } h-hd:max-h-[300px]`}
            >
              {renderAvailabilityInfo()}
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
            onSubmit={
              isUserLoggedIn ? sendAnswerLoggedIn : handleSubmit(sendAnswer)
            }
          >
            <div className="flex flex-col-reverse lg:flex-col items-center lg:items-start">
              {((mobileAnsweringMode && isMobile) || !isMobile) &&
                !isUserLoggedIn && (
                  <div>
                    <Input
                      label={dict.page.answerMeeting.input.name.label}
                      type="text"
                      id="name"
                      register={register}
                      error={errors.name ? true : false}
                      errorText={errors.name?.message?.toString()}
                      onChange={(e) => setUsername(e.target.value)}
                      value={username}
                      placeholder={
                        dict.page.answerMeeting.input.name.placeholder
                      }
                      name="name"
                      autocomplete="name"
                    />
                  </div>
                )}
              <div
                className={`self-center overflow-auto max-h-[300px] h-md:max-h-[350px] h-mdl:max-h-[400px] h-hd:max-h-[400px] md:h-lg:max-h-[600px] lg:max-h-[300px] w-auto max-w-[365px] md:max-w-[700px] lg:max-w-[350px] pr-3 ${
                  !isUserLoggedIn && "mt-5"
                } ${isMobile && "mb-10"}`}
              >
                <table className="time__seclection--table w-fit lg:mt-5 self-center select-none">
                  <thead>
                    <tr>
                      <th className="bg-light sticky top-0 left-0 z-20"></th>
                      {renderDaysHeadings()}
                    </tr>
                  </thead>
                  <tbody>{renderTimeCells()}</tbody>
                </table>
              </div>
            </div>
            {(mobileAnsweringMode && isMobile) || !isMobile ? (
              <div>
                <div className="mr-6 inline">
                  <Popup
                    trigger={
                      <button
                        type="button"
                        className="bg-primary hover:bg-primary-hover active:bg-primary-active text-light font-medium h-6 w-6 rounded-full transition-colors"
                      >
                        ?
                      </button>
                    }
                    modal
                    nested
                    closeOnDocumentClick
                  >
                    <div className="p-2 text-dark">
                      <p>
                        {dict.page.answerMeeting.help_popup.line1.segment1}
                        <span className="font-medium">
                          {dict.page.answerMeeting.help_popup.line1.segment2}
                        </span>
                        {dict.page.answerMeeting.help_popup.line1.segment3}
                      </p>
                      <p className="mb-2">
                        {dict.page.answerMeeting.help_popup.line2}
                      </p>
                      <p className="font-medium">
                        {dict.page.answerMeeting.help_popup.showMode.title}
                      </p>
                      <p className="flex items-center">
                        <span className="block h-4 w-4 rounded-full bg-primary mr-2"></span>
                        {dict.page.answerMeeting.help_popup.showMode.green}
                      </p>
                      <p className="flex items-center mb-2">
                        <span className="block h-4 w-4 rounded-full bg-gold mr-2"></span>
                        {dict.page.answerMeeting.help_popup.showMode.gold}
                      </p>
                      <p className="font-medium">
                        {dict.page.answerMeeting.help_popup.answerMode.title}
                      </p>
                      <p className="flex items-center">
                        <span className="block h-4 w-4 rounded-full bg-green mr-2"></span>
                        {dict.page.answerMeeting.help_popup.answerMode.green}
                      </p>
                      <p className="flex items-center">
                        <span className="block h-4 w-4 rounded-full bg-gold mr-2"></span>
                        {dict.page.answerMeeting.help_popup.answerMode.gold}
                      </p>
                      <p className="flex items-center">
                        <span className="block h-4 w-4 rounded-full bg-light-green mr-2"></span>
                        {
                          dict.page.answerMeeting.help_popup.answerMode
                            .lightGreen
                        }
                      </p>
                    </div>
                  </Popup>
                </div>

                <Button text={dict.page.answerMeeting.button.submit} />
                <CopyLinkButton
                  link={currentUrl}
                  dict={dict}
                  className="ml-6"
                />
              </div>
            ) : null}
          </form>
        </section>
      </div>
    </main>
  );
}
