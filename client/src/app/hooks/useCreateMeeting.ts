import { yupResolver } from "@hookform/resolvers/yup";
import { Locale } from "@root/i18n.config";
import axios from "axios";
import moment from "moment";
import "moment/locale/pl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";

// Definicje typów
interface DailyTimeRange {
  date: number;
  times: number[];
}

type Inputs = {
  meeting__name: string;
  meeting__place?: string;
  meeting__link?: string;
};

type DailyHours = {
  [date: number]: { from: number; to: number };
};

// Hook
export const useCreateMeeting = ({
  lang,
  dict,
  auth,
}: {
  lang: Locale;
  dict: any;
  auth: any;
}) => {
  moment.locale(lang);
  const router = useRouter();

  // Stan
  const [prevStep, setPrevStep] = useState(0);
  const [currStep, setCurrStep] = useState(0);
  const [timepickerIndex, setTimepickerIndex] = useState(0);
  const [meetDetails, setMeetDetails] = useState({
    name: "",
    place: "",
    link: "",
  });
  const [dailyTimeRanges, setDailyTimeRanges] = useState<DailyTimeRange[]>([]);
  const [selectedDates, setSelectedDates] = useState<number[]>([]);
  const [dateError, setDateError] = useState(false);
  const [dateErrorText, setDateErrorText] = useState("");
  const [isRequestInProgress, setIsRequestInProgress] = useState(false);
  const [dailyHours, setDailyHours] = useState<DailyHours>({});
  const [mainFromTime, setMainFromTime] = useState(8);
  const [mainToTime, setMainToTime] = useState(9);

  const delta = currStep - prevStep;

  // Formularz
  const formSchema = yup.object().shape({
    meeting__name: yup
      .string()
      .required(dict.page.createMeeting.validate.meeting__name.required)
      .min(4, dict.page.createMeeting.validate.meeting__name.min)
      .max(50, dict.page.createMeeting.validate.meeting__name.max),
    meeting__place: yup
      .string()
      .max(100, dict.page.createMeeting.validate.meeting__place.max),
    meeting__link: yup
      .string()
      .url(dict.page.createMeeting.validate.meeting__link.url),
  });

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<Inputs>({ resolver: yupResolver(formSchema) });

  const stepsInfo = [
    {
      title: dict.page.createMeeting.step.one.title,
      fields: ["meeting__name", "meeting__place", "meeting__link"],
    },
    { title: dict.page.createMeeting.step.two.title },
    { title: dict.page.createMeeting.step.three.title },
  ];

  // Logika czasu
  const convertDatetimeToTime = (datetime: number) => moment(datetime);
  const isDatetime = (datetime: number) => datetime.toString().length === 13;

  const getTimeRangeDatetimes = (
    datetime: number,
    from: number,
    to: number
  ) => {
    const datetimes: number[] = [];
    if (isDatetime(from)) from = convertDatetimeToTime(from).hour();
    if (isDatetime(to)) to = convertDatetimeToTime(to).hour() + 1;

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

  const getGlobalTimeRange = () => {
    const allFromTimes: number[] = [mainFromTime];
    const allToTimes: number[] = [mainToTime];

    Object.values(dailyHours).forEach(({ from, to }) => {
      allFromTimes.push(from);
      allToTimes.push(to);
    });

    return {
      globalFrom: Math.min(...allFromTimes),
      globalTo: Math.max(...allToTimes),
    };
  };

  const fillDailyTimeRanges = () => {
    const timeRanges: DailyTimeRange[] = [];
    const { globalFrom, globalTo } = getGlobalTimeRange();

    selectedDates.forEach((date) => {
      const dayHours = dailyHours[date];
      const fromHour = dayHours ? dayHours.from : globalFrom;
      const toHour = dayHours ? dayHours.to : globalTo;
      timeRanges.push({
        date: date,
        times: getTimeRangeDatetimes(date, fromHour, toHour),
      });
    });
    setDailyTimeRanges(timeRanges);
  };

  const updateDailyTimeRanges = (
    dayDateTime: number,
    dateTime: number,
    add: boolean
  ) => {
    setDailyTimeRanges((prev) => {
      const index = prev.findIndex((range) => range.date === dayDateTime);
      if (index === -1) return prev;
      const timeRange = prev[index];
      const newTimes = add
        ? [...timeRange.times, dateTime].sort()
        : timeRange.times.filter((time) => time !== dateTime);
      const updatedTimeRanges = [...prev];
      updatedTimeRanges[index] = { ...timeRange, times: newTimes };
      return updatedTimeRanges;
    });
  };

  const pushSelectedTimecell = (dayDateTime: number, dateTime: number) =>
    updateDailyTimeRanges(dayDateTime, dateTime, true);
  const popUnselectedTimecell = (dayDateTime: number, dateTime: number) =>
    updateDailyTimeRanges(dayDateTime, dateTime, false);

  const handleDailyHourChange = (
    date: number,
    type: "from" | "to",
    value: number
  ) => {
    setDailyHours((prev) => {
      const currentHours = prev[date] || { from: mainFromTime, to: mainToTime };
      let { from, to } = currentHours;

      if (type === "from") {
        from = value;
        if (from >= to) to = Math.min(from + 1, 24);
      } else {
        to = value;
        if (to <= from) from = Math.max(to - 1, 0);
      }
      return { ...prev, [date]: { from, to } };
    });
  };

  useEffect(() => {
    fillDailyTimeRanges();
  }, [dailyHours, mainFromTime, mainToTime]);

  // Walidacja i nawigacja
  const validateDate = () => {
    if (selectedDates.length < 1) {
      setDateError(true);
      setDateErrorText(dict.page.createMeeting.validate.date.required);
      return false;
    }
    if (selectedDates.length > 15) {
      setDateError(true);
      setDateErrorText(dict.page.createMeeting.validate.date.max);
      return false;
    }
    setDateError(false);
    setDateErrorText("");
    return true;
  };

  const createMeeting: SubmitHandler<Inputs> = async (data) => {
    if (isRequestInProgress || !validateDate()) return;
    setIsRequestInProgress(true);
    try {
      const meetData = {
        meetName: data.meeting__name,
        authorId: auth?.user.id,
        meetPlace: data.meeting__place,
        meetLink: data.meeting__link,
        dates: dailyTimeRanges,
      };
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/meet/new`,
        meetData
      );
      router.push(`/meet/${response.data.appointmentId}`);
    } catch (error) {
      console.error(error);
      setIsRequestInProgress(false);
    }
  };

  const next = async () => {
    if (currStep === 0) {
      const output = await trigger(
        ["meeting__name", "meeting__place", "meeting__link"],
        { shouldFocus: true }
      );
      if (!output) return;
    }
    if (currStep === 1 && !validateDate()) return;

    if (currStep < stepsInfo.length - 1) {
      setPrevStep(currStep);
      setCurrStep(currStep + 1);
      if (currStep === 1) {
        setSelectedDates((d) => [...d].sort());
        fillDailyTimeRanges();
      }
    } else if (currStep === stepsInfo.length - 1) {
      await handleSubmit(createMeeting)();
    }
  };

  const prev = () => {
    if (currStep === 0) router.push("/");
    else {
      setPrevStep(currStep);
      setCurrStep(currStep - 1);
    }
  };

  return {
    // Stan
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
    // Metody
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
  };
};
