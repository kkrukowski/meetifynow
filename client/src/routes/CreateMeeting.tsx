import { yupResolver } from "@hookform/resolvers/yup";
import { motion } from "framer-motion";
import _ from "lodash";
import moment from "moment";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";

// Components
import Button from "../components/Button";
import DetailedTimepicker from "../components/CreateMeeting/DetailedTimepicker";
import StepsIndicator from "../components/CreateMeeting/StepsIndicator";
import Timepicker from "../components/CreateMeeting/Timepicker";
import IconButton from "../components/IconButton";
import Input from "../components/Input";
import Title from "../components/Title";
import { generateShortDaysNames } from "../utils/meeting/TimeFunctions";

// Icons
import {
  faCalendar,
  faCalendarDay,
  faCalendarDays,
} from "@fortawesome/free-solid-svg-icons";

import axios from "axios";

export default function CreateMeeting() {
  // Translation
  const { t } = useTranslation();
  // Steps
  const [prevStep, setPrevStep] = useState(0);
  const [currStep, setCurrStep] = useState(0);
  const delta = currStep - prevStep;

  // Timepickers navigation
  const [timepickerIndex, setTimepickerIndex] = useState(0);

  // Name
  const [meetDetails, setMeetDetails] = useState({
    name: "" as string,
    place: "" as string,
    link: "" as string,
  });

  // Daily time
  interface DailyTimeRange {
    date: number;
    times: number[];
  }

  const [dailyTimeRanges, setDailyTimeRanges] = useState<DailyTimeRange[]>([]);

  const getStartTime = (datetime: number) => {
    const timeRange = dailyTimeRanges.find((range) => range.date === datetime);
    if (timeRange) {
      return timeRange.times[0];
    }
    return 8;
  };

  const getEndTime = (datetime: number) => {
    const timeRange = dailyTimeRanges.find((range) => range.date === datetime);
    if (timeRange) {
      return timeRange?.times[timeRange?.times.length - 1];
    }
    return 9;
  };

  const convertDatetimeToTime = (datetime: number) => {
    return moment(datetime);
  };

  const isDatetime = (datetime: number) => {
    return datetime.toString().length === 13;
  };

  const getTimeRangeDatetimes = (
    datetime: number,
    from: number,
    to: number
  ) => {
    const datetimes: number[] = [];

    if (isDatetime(from)) {
      from = convertDatetimeToTime(from).hour();
    }
    if (isDatetime(to)) {
      to = convertDatetimeToTime(to).hour() + 1;
    }
    for (let i = from; i < to; i++) {
      for (let hourHalf = 0; hourHalf < 2; hourHalf++) {
        const time = moment(datetime)
          .hour(i)
          .minute(hourHalf * 30)
          .valueOf();

        datetimes.push(time);
      }
    }

    return datetimes;
  };

  const fillDailyTimeRanges = () => {
    const timeRanges: DailyTimeRange[] = [];
    selectedDates.forEach((date) => {
      timeRanges.push({
        date: date,
        times: getTimeRangeDatetimes(date, 8, 9),
      });
    });
    setDailyTimeRanges(timeRanges);
  };

  const isDatetimeExistInRanges = (datetime: number) => {
    return dailyTimeRanges.some((range) => range.date === datetime);
  };

  const getDailyTimeRangeIndex = (datetime: number) => {
    return dailyTimeRanges.findIndex((range) => range.date === datetime);
  };

  const handleDailyTimeRangeChange = (
    e: { target: { value: string } },
    datetime: number,
    fromTime: boolean
  ) => {
    const hour = +e.target.value.split(":")[0];
    let newTimeRanges: DailyTimeRange[] = [];

    if (timepickerIndex === 0 && datetime === -1) {
      const dates = dailyTimeRanges.map((range) => range.date);
      newTimeRanges = dates.map((date) => ({
        date,
        times: getTimeRangeDatetimes(
          date,
          fromTime ? hour : getStartTime(date),
          fromTime ? getEndTime(date) : hour
        ),
      }));
      setDailyTimeRanges(newTimeRanges);
    } else {
      if (isDatetimeExistInRanges(datetime)) {
        const index = getDailyTimeRangeIndex(datetime);
        const newTimeRange = {
          date: datetime,
          times: getTimeRangeDatetimes(
            datetime,
            fromTime ? hour : getStartTime(datetime),
            fromTime ? getEndTime(datetime) : hour
          ),
        };

        if (index !== -1) {
          setDailyTimeRanges((prevTimeRanges) => {
            const updatedTimeRanges = [...prevTimeRanges];
            updatedTimeRanges[index] = newTimeRange;
            return updatedTimeRanges;
          });
        }
      }
    }
  };

  const updateDailyTimeRanges = (
    dayDateTime: number,
    dateTime: number,
    add: boolean
  ) => {
    setDailyTimeRanges((prevTimeRanges) => {
      const index = getDailyTimeRangeIndex(dayDateTime);
      const timeRange = prevTimeRanges[index];
      const newTimes = add
        ? [...timeRange.times, dateTime].sort()
        : timeRange.times.filter((time) => time !== dateTime);

      const newTimeRange = {
        date: dayDateTime,
        times: newTimes,
      };

      const updatedTimeRanges = [...prevTimeRanges];
      updatedTimeRanges[index] = newTimeRange;
      return updatedTimeRanges;
    });
  };

  const pushSelectedTimecell = (dayDateTime: number, dateTime: number) => {
    updateDailyTimeRanges(dayDateTime, dateTime, true);
  };

  const popUnselectedTimecell = (dayDateTime: number, dateTime: number) => {
    updateDailyTimeRanges(dayDateTime, dateTime, false);
  };

  // Detailed time

  // CALENDAR
  // Selecting dates
  const [selectedDates, setSelectedDates] = useState<number[]>([]);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [dateError, setDateError] = useState(false);
  const [dateErrorText, setDateErrorText] = useState("");

  const toggleTimecell = (dateTime: number) => {
    if (selectedDates.includes(dateTime)) {
      if (!selectionMode) {
        setSelectedDates(selectedDates.filter((d) => d !== dateTime));
      }
      if (!isMouseDown) {
        setSelectionMode(false);
        setSelectedDates(selectedDates.filter((d) => d !== dateTime));
        setIsMouseDown(true);
      }
    } else {
      if (selectionMode) {
        setSelectedDates([...selectedDates, dateTime]);
      }
      if (!isMouseDown) {
        setSelectionMode(true);
        setSelectedDates([...selectedDates, dateTime]);
        setIsMouseDown(true);
      }
    }
  };

  const handleMouseOver = (dateTime: number) => {
    if (isMouseDown) {
      toggleTimecell(dateTime);
    }
  };

  // Rendering calerdar
  const showCalendar = (month: number, year: number) => {
    var firstDay = new Date(year, month, 1).getDay();
    if (firstDay === 0) {
      firstDay = 7;
    }
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const daysUntilFirstMonday = (7 - ((firstDay + 6) % 7)) % 7;
    const remainingDays = daysInMonth - daysUntilFirstMonday;
    const weeksInMonth = 1 + Math.ceil(remainingDays / 7);

    let tableRows = [];
    let day = 1;
    let e = 0;

    const dateNow = new Date();
    for (let i = 0; i < weeksInMonth; i++) {
      let tableCells = [];
      for (let j = 0; j < 7; j++) {
        const date = moment().month(month).year(year).startOf("day").date(day);
        const dateTime = date.valueOf();

        const isPast = dateTime < moment().subtract(1, "days").valueOf();
        if (day <= daysInMonth && (i > 0 || j >= firstDay - 1)) {
          let tableCellElement;
          if (!isPast) {
            tableCellElement = (
              <td
                key={"d" + date.date()}
                data-date={dateTime}
                onMouseDown={() => toggleTimecell(dateTime)}
                onMouseUp={() => setIsMouseDown(false)}
                onMouseOver={() => handleMouseOver(dateTime)}
                className={`h-10 w-10 font-medium text-center cursor-pointer ${
                  selectedDates.includes(dateTime)
                    ? `${
                        dateNow.getDate() == day &&
                        dateNow.getMonth() == month &&
                        dateNow.getFullYear() == year
                          ? "border border-2 border-dark bg-primary text-light rounded-lg selected"
                          : "bg-primary rounded-lg text-light selected"
                      }`
                    : `${
                        dateNow.getDate() == day &&
                        dateNow.getMonth() == month &&
                        dateNow.getFullYear() == year
                          ? "border border-2 border-primary rounded-lg"
                          : ""
                      }`
                }`}
              >
                {date.date()}
              </td>
            );
          } else {
            tableCellElement = (
              <td
                key={"d" + date.date()}
                className={`h-10 w-10 font-medium text-center cursor-pointer text-gray`}
              >
                {date.date()}
              </td>
            );
          }
          tableCells.push(tableCellElement);
          day++;
        } else {
          tableCells.push(<td key={"e" + e}></td>);
          e++;
        }
      }
      tableRows.push(<tr key={"w" + i}>{tableCells}</tr>);
    }

    return tableRows;
  };

  const currentDate = moment();
  const [month, setMonth] = useState(currentDate.month());
  const [year, setYear] = useState(currentDate.year());

  const prevMonth = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const nextMonth = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const shortDaysNames = generateShortDaysNames();

  // VALIDATION
  // Date validation
  const validateDate = () => {
    if (selectedDates.length < 1) {
      setDateError(true);
      setDateErrorText(t("createMeeting.validate.date.required"));
      return false;
    }

    if (selectedDates.length > 15) {
      setDateError(true);
      setDateErrorText(t("createMeeting.validate.date.max"));
      return false;
    }

    setDateError(false);
    setDateErrorText("");
    return true;
  };

  // Create meeting
  const navigate = useNavigate();
  const [isRequestInProgress, setIsRequestInProgress] = useState(false);
  const createMeeting: SubmitHandler<Inputs> = async () => {
    if (isRequestInProgress) {
      return;
    }
    try {
      setIsRequestInProgress(true);
      if (!validateDate()) {
        return;
      }
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/meet/new`,
        {
          meetName: meetDetails?.name,
          meetPlace: meetDetails?.place,
          meetLink: meetDetails?.link,
          dates: dailyTimeRanges,
        }
      );

      const meetId = response.data.newMeet.appointmentId;
      const meetUrl = `/meet/${meetId}`;
      navigate(meetUrl);
    } catch (error) {
      console.error(error);
    } finally {
      setIsRequestInProgress(false);
    }
  };

  // Form validation
  const formSchema = yup.object().shape({
    meeting__name: yup
      .string()
      .required(t("createMeeting.validate.meeting__name.required"))
      .min(4, t("createMeeting.validate.meeting__name.min"))
      .max(50, t("createMeeting.validate.meeting__name.max")),
    meeting__place: yup
      .string()
      .max(100, t("createMeeting.validate.meeting__place.max")),
    meeting__link: yup.string().url(t("createMeeting.validate.meeting__link")),
  });

  type Inputs = {
    meeting__name: string;
  };

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm({ resolver: yupResolver(formSchema) });

  const stepsInfo = [
    {
      title: t("createMeeting.step.one.title"),
      fields: ["meeting__name", "meeting__place", "meeting__link"],
    },
    {
      title: t("createMeeting.step.two.title"),
    },
    {
      title: t("createMeeting.step.three.title"),
    },
  ];

  type FieldName = keyof Inputs;

  const next = async () => {
    const fields = stepsInfo[currStep].fields;
    const output = await trigger(fields as FieldName[], { shouldFocus: true });
    if (!output) return;

    if (currStep < stepsInfo.length) {
      if (currStep === 1) {
        if (validateDate()) {
          setPrevStep(currStep);
          setCurrStep(currStep + 1);
          // Sort selectedDates
          setSelectedDates(selectedDates.sort());
          fillDailyTimeRanges();
        }
      }

      if (currStep !== 1 && currStep !== 2) {
        setPrevStep(currStep);
        setCurrStep(currStep + 1);
      }

      if (currStep === 2) {
        handleSubmit(createMeeting)();
      }
    }
  };

  const prev = () => {
    if (currStep > 0) {
      setPrevStep(currStep);
      setCurrStep(currStep - 1);
    }
  };

  return (
    <main className="flex flex-1 h-full flex-col px-5 py-10 pt-20 lg:p-20 lg:pt-28 h-smd:pt-20 lg:m-0 justify-center">
      <Title text={t("createMeeting.title")} />
      <StepsIndicator steps={4} stepsData={stepsInfo} currIndex={currStep} />
      <form
        id="create-meeting-form"
        className="flex flex-col justify-center h-[400px]"
      >
        <div className="self-center">
          {/* Meeting details */}
          {currStep === 0 && (
            <motion.div
              initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <Input
                label={t("createMeeting.input.meeting__name.label")}
                type="text"
                id="meeting__name"
                register={register}
                errorText={errors.meeting__name?.message?.toString()}
                error={errors.meeting__name ? true : false}
                placeholder={t("createMeeting.input.meeting__name.placeholder")}
                onChange={(e: {
                  target: { value: React.SetStateAction<string> };
                }) =>
                  setMeetDetails({
                    ...meetDetails,
                    name: e.target.value.toString(),
                  })
                }
                required={true}
              />
              <Input
                label={t("createMeeting.input.meeting__place.label")}
                type="text"
                id="meeting__place"
                register={register}
                errorText={errors.meeting__place?.message?.toString()}
                error={errors.meeting__place ? true : false}
                placeholder={t(
                  "createMeeting.input.meeting__place.placeholder"
                )}
                onChange={(e: {
                  target: { value: React.SetStateAction<string> };
                }) =>
                  setMeetDetails({
                    ...meetDetails,
                    place: e.target.value.toString(),
                  })
                }
              />
              <Input
                label={t("createMeeting.input.meeting__link.label")}
                type="text"
                id="meeting__link"
                register={register}
                errorText={errors.meeting__link?.message?.toString()}
                error={errors.meeting__link ? true : false}
                placeholder={t("createMeeting.input.meeting__link.placeholder")}
                onChange={(e: {
                  target: { value: React.SetStateAction<string> };
                }) =>
                  setMeetDetails({
                    ...meetDetails,
                    link: e.target.value.toString(),
                  })
                }
              />
            </motion.div>
          )}

          {/* Choose date */}
          {currStep === 1 && (
            <motion.div
              initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="flex flex-col self-center">
                <table
                  className={`date__selection--table border border-2 border-separate border-spacing-0.5 box-content p-2 select-none w-[296px] ${
                    dateError ? "rounded-lg border-red" : "border-transparent"
                  }`}
                >
                  <thead>
                    <tr>
                      <th colSpan={7}>
                        <div className="flex justify-between items-center">
                          <button
                            onClick={prevMonth}
                            className="h-10 w-10 rounded-lg bg-light hover:bg-light-hover active:bg-light-active shadow-md transition-colors flex justify-center items-center"
                          >
                            <IoChevronBack />
                          </button>
                          <span className="text-dark">
                            {_.capitalize(
                              moment().month(month).format("MMMM")
                            ) +
                              " " +
                              year}
                          </span>
                          <button
                            onClick={nextMonth}
                            className="h-10 w-10 rounded-lg bg-light hover:bg-light-hover active:bg-light-active shadow-md transition-colors flex justify-center items-center"
                          >
                            <IoChevronForward />
                          </button>
                        </div>
                      </th>
                    </tr>
                    <tr>
                      {shortDaysNames.map((day) => (
                        <th className="font-medium text-gray">{day}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>{showCalendar(month, year)}</tbody>
                </table>
                <p className="text-sm relative mt-2 text-red font-medium">
                  {dateError && dateErrorText}
                </p>
              </div>
            </motion.div>
          )}

          {/* Choose time */}
          {currStep === 2 && (
            <motion.div
              initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="flex justify-center mb-5">
                <div className="flex flex-col justify-center items-center">
                  <div className="mb-6">
                    <IconButton
                      icon={faCalendar}
                      onClick={setTimepickerIndex}
                      valueToChange={0}
                      isCurrent={timepickerIndex === 0}
                    />
                    <IconButton
                      icon={faCalendarDay}
                      className="ml-6"
                      onClick={setTimepickerIndex}
                      valueToChange={1}
                      isCurrent={timepickerIndex === 1}
                    />
                    <IconButton
                      icon={faCalendarDays}
                      className="ml-6"
                      onClick={setTimepickerIndex}
                      valueToChange={2}
                      isCurrent={timepickerIndex === 2}
                    />
                  </div>
                  <div
                    className={`self-center overflow-y-auto h-[300px] ${
                      timepickerIndex !== 2 && "p-2"
                    }`}
                  >
                    {/* Main time picking */}
                    {timepickerIndex === 0 && (
                      <>
                        <Timepicker
                          from={true}
                          fromTime={moment(
                            getStartTime(dailyTimeRanges[0].date)
                          ).hour()}
                          toTime={moment(
                            getEndTime(dailyTimeRanges[0].date)
                          ).hour()}
                          onChange={(e) =>
                            handleDailyTimeRangeChange(e, -1, true)
                          }
                        />
                        <span className="m-4"> - </span>
                        <Timepicker
                          from={false}
                          fromTime={moment(
                            getStartTime(dailyTimeRanges[0].date)
                          ).hour()}
                          toTime={moment(
                            getEndTime(dailyTimeRanges[0].date)
                          ).hour()}
                          onChange={(e) =>
                            handleDailyTimeRangeChange(e, -1, false)
                          }
                        />
                      </>
                    )}

                    {/* Daily main time picking */}
                    {timepickerIndex === 1 && (
                      <>
                        {dailyTimeRanges.map(
                          (dayTimeRange: { date: number }) => {
                            const dateObj = moment(dayTimeRange.date);

                            const fromTime = moment(
                              getStartTime(dayTimeRange.date)
                            ).hour();
                            const toTime = moment(
                              getEndTime(dayTimeRange.date)
                            ).hour();
                            return (
                              <div className="flex justify-between w-[310px] md:w-[400px] items-center mb-4 px-2">
                                <div className="flex flex-col h-14 w-14 bg-primary rounded-lg justify-center">
                                  <p className="text-3xl text-center text-light leading-none">
                                    {dateObj.date()}
                                  </p>
                                  <p className="text-center text-light leading-none">
                                    {shortDaysNames[dateObj.day() - 1]}
                                  </p>
                                </div>
                                <div>
                                  <Timepicker
                                    from={true}
                                    fromTime={fromTime}
                                    toTime={toTime}
                                    onChange={(e) => {
                                      handleDailyTimeRangeChange(
                                        e,
                                        dateObj.valueOf(),
                                        true
                                      );
                                    }}
                                  />
                                  <span className="m-2 md:m-4"> - </span>
                                  <Timepicker
                                    from={false}
                                    fromTime={fromTime}
                                    toTime={toTime}
                                    onChange={(e) => {
                                      handleDailyTimeRangeChange(
                                        e,
                                        dateObj.valueOf(),
                                        false
                                      );
                                    }}
                                  />
                                </div>
                              </div>
                            );
                          }
                        )}
                      </>
                    )}

                    {/* Detailed time picking */}
                    {timepickerIndex === 2 && (
                      <div className="w-auto max-w-[330px] md:max-w-[700px] lg:max-w-[350px]">
                        <DetailedTimepicker
                          dates={dailyTimeRanges}
                          pushSelectedTimecell={pushSelectedTimecell}
                          popUnselectedTimecell={popUnselectedTimecell}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </form>
      {/* Navigation */}
      {currStep < 3 && (
        <div className="self-center">
          <Button
            text={t("button.back")}
            onClick={prev}
            className="mr-10"
            disabled={currStep === 0}
          />
          <Button
            text={`${
              currStep === 2 ? t("button.createMeeting") : t("button.next")
            }`}
            onClick={next}
          />
        </div>
      )}
    </main>
  );
}
