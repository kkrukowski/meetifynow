"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import _, { set } from "lodash";
import moment from "moment";
import "moment/locale/pl";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMediaQuery } from "react-responsive";
import * as yup from "yup";
// Components
import Button from "@/components/Button";
import CopyLinkButton from "@/components/CopyLinkButton";
import Heading from "@/components/Heading";
import Input from "@/components/Input";
import LinkButton from "@/components/LinkButton";
import SwitchButton from "@/components/SwitchButton";
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
}: {
  lang: Locale;
  dict: any;
  meetingData: any;
}) {
  moment.locale(lang);
  const pathname = usePathname();
  const [selectedTimecells, setSelectedTimecells] = useState<MeetingDate[]>([]);

  class MeetingDate {
    meetDate: number;
    isOnline: boolean;

    constructor(meetDate: number, isOnline: boolean) {
      this.meetDate = meetDate;
      this.isOnline = isOnline;
    }
  }
  const [selectionMode, setSelectionMode] = useState(false);
  const [lookedUpDatetime, setLookedUpDatetime] = useState<number>();
  const [lookedUpDate, setLookedUpDate] = useState<string>();
  const [lookedUpTime, setLookedUpTime] = useState<string>();
  const [username, setUsername] = useState("");
  const [availableCount, setAvailableCount] = useState(0);
  const [answers, setAnswers] = useState<any>(meetingData.answers);
  const [meetName, setMeetName] = useState(meetingData.meetName);
  const meetPlace = meetingData.meetPlace;
  const meetLink = meetingData.meetLink;
  const answersCount = answers.length;
  const datesInfo = meetingData.dates;
  const [unavailableUsersInfo, setUnavailableUsersInfo] = useState<any>([]);
  const [highestAvailableCount, setHighestAvailableCount] = useState(0);
  const [mobileAnsweringMode, setMobileAnsweringMode] = useState(true);
  const currentUrl = pathname;

  // Checking mobile mode
  const isMobile = useMediaQuery({
    query: "(max-width: 1024px)",
  });

  // Handling mouse down
  const isMouseDown = useMouseDown();

  // Availability info
  useEffect(() => {
    setUnavailableUsersInfo(getUnavailableUsersInfo(answers));
  }, [answers]);

  const availabilityInfo = getAvailabilityInfo(answers);

  const toggleAnsweringMode = () =>
    setMobileAnsweringMode((prevMode) => !prevMode);

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
    updateTimecell(dateTime, false);
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

    if (isSelected) {
      if (!selectionMode) {
        if (selectedTimecell?.isOnline) {
          // Selecting timecell online -> unselected (click)
          unselectTimecell(dateTime);
          setOnlineSelectionMode(false);
        } else if (!onlineSelectionMode && !selectedTimecell?.isOnline) {
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
  };

  const flatTimes: number[] = datesInfo.flatMap((date: any) => date.times);

  const getMinimumTimeInDates = (): moment.Moment =>
    moment(Math.min(...flatTimes));
  const getMaximumTimeInDates = (): moment.Moment =>
    moment(Math.max(...flatTimes));

  const isMinimumTimeHalfHour = (): boolean =>
    getMinimumTimeInDates().minute() === 30;
  const isMaximumTimeHalfHour = (): boolean =>
    getMaximumTimeInDates().minute() === 0;

  const renderTimeCells = () => {
    const disabledTimecell = () => (
      <td>
        <div className="rounded-lg h-12 w-24 lg:h-6 lg:w-12 bg-light-gray cursor-default"></div>
      </td>
    );

    const minimumTimeHour = getMinimumTimeInDates().hour();
    const maximumTimeHour = getMaximumTimeInDates().hour();

    var timeCells: JSX.Element[] = [];

    for (let i = minimumTimeHour; i <= maximumTimeHour; i++) {
      for (let h = 0; h < 2; h++) {
        // Handle half hours
        const isHalfHour = h === 1;
        if (i == maximumTimeHour && isHalfHour && isMaximumTimeHalfHour())
          break;
        if (i == minimumTimeHour && isHalfHour && isMinimumTimeHalfHour())
          continue;

        let timeRow: JSX.Element[] = [];
        for (const date of dates) {
          const dateTime = moment(date.date)
            .hour(i)
            .minute(isHalfHour ? 30 : 0)
            .valueOf();

          const isEndOfWeek = moment(dateTime).day() == 0;

          const cellComponent = flatTimes.includes(dateTime)
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
        timeCells.push(
          <tr
            key={`${i}${isHalfHour ? "30" : "00"}`}
            className="cursor-pointer"
          >
            {h === 0 && (
              <th
                rowSpan={
                  i == maximumTimeHour && isMaximumTimeHalfHour() ? 1 : 2
                }
                className="text-right text-dark align-top bg-light sticky left-0 pr-2"
              >
                {`${i.toString().padStart(2, "0")}:${isHalfHour ? "30" : "00"}`}
              </th>
            )}
            {timeRow}
          </tr>
        );
      }
    }

    // Add end hour row
    const endHour = isMaximumTimeHalfHour()
      ? maximumTimeHour
      : maximumTimeHour + 1;
    const key = `${endHour}${isMaximumTimeHalfHour() ? "30" : "00"}`;
    timeCells.push(
      <tr key={key} className="cursor-pointer">
        <th className="text-right text-dark align-bottom bg-light sticky left-0 pr-2">
          {`${endHour.toString().padStart(2, "0")}:${
            isMaximumTimeHalfHour() ? "30" : "00"
          }`}
        </th>
      </tr>
    );

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
      } else if (isMobileAnsweringMode && !unselectMode) {
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
    return dates.map((day: any) => {
      const dateMoment = moment(day.date);
      const date = dateMoment.date();
      const month = dateMoment.month() + 1;
      const dayOfWeek = dateMoment.day();
      const classNames = dayOfWeek === 0 ? "pr-4" : "";
      return (
        <th key={date} className={`bg-light sticky top-0 z-10 ${classNames}`}>
          <p className="text-sm text-dark font-medium">
            {`${date.toString().padStart(2, "0")}.${month
              .toString()
              .padStart(2, "0")}`}
          </p>
          <p className="text-dark">{_.capitalize(dateMoment.format("ddd"))}</p>
        </th>
      );
    });
  };

  const renderAvailabilityInfo = () => {
    if (lookedUpDatetime) {
      if (!availabilityInfo[lookedUpDatetime]) {
        return (
          <li className="text-dark">
            {dict.page.answerMeeting.nobodyAvailable}
          </li>
        );
      } else {
        const dayAvailabilityInfo = availabilityInfo[lookedUpDatetime];
        const availableUsers = dayAvailabilityInfo?.usersInfo;

        const onlineAvailableUsers = availableUsers?.filter(
          (user: any) => user.isOnline === true
        );

        const listOfOnlineAvailableUsers = onlineAvailableUsers?.map(
          (userData: any) => (
            <li key={userData.userData.userId}>
              {userData.userData.username} 🛜
            </li>
          )
        );

        const offlineAvailableUsers = availableUsers?.filter(
          (user: any) => user.isOnline === false
        );

        const listOfOfflineAvailableUsers = offlineAvailableUsers?.map(
          (userData: any) => (
            <li key={userData.userData.userId}>{userData.userData.username}</li>
          )
        );

        const listOfUnavailableUsers = unavailableUsersInfo?.map(
          (userData: any) => (
            <li key={userData.userData.userId} className="text-gray">
              <s>{userData.userData.username}</s>
            </li>
          )
        );
        const listOfUsernames = [
          listOfOnlineAvailableUsers,
          listOfOfflineAvailableUsers,
          listOfUnavailableUsers,
        ];

        return listOfUsernames;
      }
    } else {
      if (isMobile) {
        return <li>{dict.page.answerMeeting.clickToReveal}</li>;
      }
      return <li>{dict.page.answerMeeting.hoverToReveal}</li>;
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

      const answerResponse = await axios.post(
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
    <main className="flex flex-1 flex-col lg:justify-center p-5 pt-20 lg:p-20 lg:pt-28 h-smd:pt-20 w-full lg:w-[800px]">
      <Title text={meetName} />
      {/* Meeting details */}
      {(meetPlace || meetLink) && (
        <div className="mb-10">
          {meetPlace && <p>🏢 {meetPlace}</p>}
          {meetLink && (
            <p>
              🔗 <LinkButton href={meetLink} text="Link do spotkania" />
            </p>
          )}
        </div>
      )}

      {/* Meeting data */}
      <div className="flex flex-1 lg:flex-none justify-end items-center lg:items-start flex-col-reverse lg:justify-start lg:flex-row">
        {(!mobileAnsweringMode && isMobile) || !isMobile ? (
          <section className="availability__info w-full lg:w-1/2 lg:mr-10">
            <p>
              {lookedUpDate} {lookedUpTime}
            </p>
            {lookedUpDate && (
              <Heading text={`${availableCount}/${answersCount}`} />
            )}
            <ul className="overflow-auto max-h-[100px] h-hd:max-h-[300px]">
              {renderAvailabilityInfo()}
            </ul>
          </section>
        ) : null}

        <section className="flex flex-col time__selection lg:w-1/2">
          {isMobile && (
            <div className="flex items-center justify-center">
              <span className="text-2xl">✅</span>
              <SwitchButton
                isAnsweringMode={mobileAnsweringMode}
                toggleAnsweringMode={toggleAnsweringMode}
              />
              <span className="text-2xl">👀</span>
            </div>
          )}

          <form
            className="flex flex-1 flex-col place-content-start items-center"
            onSubmit={handleSubmit(sendAnswer)}
          >
            <div className="flex flex-col-reverse lg:flex-col items-center lg:items-start">
              {(mobileAnsweringMode && isMobile) || !isMobile ? (
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
                    placeholder={dict.page.answerMeeting.input.name.placeholder}
                  />
                </div>
              ) : null}
              <div
                className={`self-center overflow-auto h-smd:max-h-[300px] h-md:max-h-[350px] h-mdl:max-h-[400px] h-hd:max-h-[400px] md:h-lg:max-h-[600px] lg:max-h-[300px] w-auto max-w-[360px] md:max-w-[700px] lg:max-w-[350px] pr-3 mt-5 ${
                  isMobile && "mb-5"
                }`}
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
