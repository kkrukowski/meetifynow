import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import moment, { max } from "moment-timezone";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";

import Button from "../components/Button";
import CopyLinkButton from "../components/CopyLinkButton";
import Heading from "../components/Heading";
import Input from "../components/Input";
import SwitchButton from "../components/SwitchButton";
import Title from "../components/Title";

export default function AnswerMeeting(props: any) {
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
  const [answers, setAnswers] = useState<any>(props.answers);
  const [meetName, setMeetName] = useState(props.meetName);
  const answersCount = answers.length;
  const datesInfo = props.dates;
  const [unavailableUsersInfo, setUnavailableUsersInfo] = useState<any>([]);
  const [highestAvailableCount, setHighestAvailableCount] = useState(0);
  const [mobileAnsweringMode, setMobileAnsweringMode] = useState(true);
  const currentUrl = window.location.href;

  // Get window size info
  // Checking mobile mode
  const [windowSize, setWindowSize] = useState([
    window.innerWidth,
    window.innerHeight,
  ]);

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowSize([window.innerWidth, window.innerHeight]);
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  const isMobile = () => {
    return windowSize[0] < 1024;
  };

  // Handling mouse down
  const [isMouseDown, setIsMouseDown] = useState(false);
  useEffect(() => {
    const handleMouseDown = () => {
      setIsMouseDown(true);
    };

    const handleMouseUp = () => {
      setIsMouseDown(false);
    };

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
  }, [isMouseDown]);

  // Get unavailable users where dates array is empty
  useEffect(() => {
    const unavailableUsers = answers.filter(
      (answer: any) => answer.dates.length == 0
    );

    const unavailableUsersInfo = unavailableUsers.map((user: any) => {
      return {
        date: null,
        userData: { userId: user.userId, username: user.username },
        answerData: { isOnline: null },
      };
    });

    setUnavailableUsersInfo(unavailableUsersInfo);
  }, [answers]);

  // Availability info
  const availabilityInfoNonMerged = () => {
    let availableUsersInfo: any = [];
    answers.flatMap((answer: any) => {
      const availableUserInfo = answer.dates.map((date: any) => {
        return {
          date: date.meetDate,
          userData: { userId: answer.userId, username: answer.username },
          answerData: { isOnline: date.isOnline },
        };
      });
      availableUsersInfo.push(...availableUserInfo);
    });

    return [...availableUsersInfo];
  };

  const availabilityInfo = availabilityInfoNonMerged().reduce(
    (acc: any, curr: any) => {
      const isOnline = curr.answerData.isOnline;
      if (acc[curr.date]) {
        acc[curr.date].usersInfo.push({
          userData: curr.userData,
          isOnline,
        });
        acc[curr.date].onlineCount += isOnline ? 1 : 0;
      } else {
        acc[curr.date] = {
          usersInfo: [{ userData: curr.userData, isOnline }],
          onlineCount: isOnline ? 1 : 0,
        };
      }
      return acc;
    },
    {}
  );

  // Mobile answering mode
  const toggleAnsweringMode = () => {
    setMobileAnsweringMode(!mobileAnsweringMode);
  };

  // Answering functionallity
  const dates = props.dates.sort();

  const isDateSelected = (dateTime: number) => {
    return selectedTimecells.some(
      (meetDateInfo) => meetDateInfo.meetDate === dateTime
    );
  };

  const getSelectedTimecell = (dateTime: number) => {
    return selectedTimecells.find(
      (meetDateInfo) => meetDateInfo.meetDate === dateTime
    );
  };

  const updateTimecellToOnline = (dateTime: number) => {
    let updatedTimecellIndex = selectedTimecells.findIndex(
      (meetDateInfo) => meetDateInfo.meetDate === dateTime
    );
    selectedTimecells[updatedTimecellIndex].isOnline = true;
  };

  const updateTimecellToOffline = (dateTime: number) => {
    let updatedTimecellIndex = selectedTimecells.findIndex(
      (meetDateInfo) => meetDateInfo.meetDate === dateTime
    );
    selectedTimecells[updatedTimecellIndex].isOnline = false;
  };

  const unselectTimecell = (dateTime: number) => {
    if (!isMobile()) {
      setUnselectMode(true);
    }
    updateTimecellToOffline(dateTime);
    setSelectedTimecells(
      selectedTimecells.filter(
        (meetDateInfo) => meetDateInfo.meetDate !== dateTime
      )
    );
  };

  const [onlineSelectionMode, setOnlineSelectionMode] = useState(false);
  const [unselectMode, setUnselectMode] = useState(false);

  const toggleTimecell = (dateTime: number) => {
    if (isDateSelected(dateTime)) {
      const selectedTimecell = getSelectedTimecell(dateTime);
      // First click when timecell is selected
      // When NOT in selection mode
      if (!selectionMode) {
        if (selectedTimecell?.isOnline) {
          unselectTimecell(dateTime);
        } else if (!selectedTimecell?.isOnline) {
          updateTimecellToOnline(dateTime);
        }
      }

      if (selectionMode && onlineSelectionMode && !selectedTimecell?.isOnline) {
        updateTimecellToOnline(dateTime);
      }

      if (
        selectionMode &&
        !onlineSelectionMode &&
        (selectedTimecell?.isOnline || unselectMode)
      ) {
        unselectTimecell(dateTime);
      }
    } else {
      // First click when timecell is NOT selected
      if (!unselectMode) {
        const meetDateInfo = new MeetingDate(dateTime, onlineSelectionMode);
        setSelectedTimecells([...selectedTimecells, meetDateInfo]);
      }
    }
  };

  const disableSelection = () => {
    if (!isMouseDown) {
      setSelectionMode(false);
      setUnselectMode(false);
      setOnlineSelectionMode(false);
    }
  };

  const handleMouseOver = (dateTime: number) => {
    if (selectionMode) {
      toggleTimecell(dateTime);
    }
  };

  // Table rendering
  const convertDatetimeToDate = (datetime: number) => {
    const date = moment.utc(datetime);
    const convertedDate =
      date.date().toString().padStart(2, "0") +
      "." +
      (date.month() + 1).toString().padStart(2, "0") +
      " " +
      daysNaming[date.day()];
    const convertedTime =
      date.hour().toString().padStart(2, "0") +
      ":" +
      date.minute().toString().padStart(2, "0");
    setLookedUpDate(convertedDate);
    setLookedUpTime(convertedTime);
  };

  const flatTimes = datesInfo.flatMap((date: any) => date.times);

  const getMinimumTimeInDates = () => {
    return moment(Math.min(...flatTimes));
  };

  const getMaximumTimeInDates = () => {
    return moment(Math.max(...flatTimes));
  };

  const isMinimumTimeHalfHour = () => {
    return moment(getMinimumTimeInDates()).minute() == 30;
  };

  const isMaximumTimeHalfHour = () => {
    return moment(getMaximumTimeInDates()).minute() == 0;
  };

  const renderTimeCells = () => {
    const minimumTimeHour = getMinimumTimeInDates().hour();
    const maximumTimeHour = getMaximumTimeInDates().hour();

    var timeCells: any = [];

    for (let i = minimumTimeHour; i <= maximumTimeHour; i++) {
      for (let h = 0; h < 2; h++) {
        // Handle half hours
        if (i == maximumTimeHour && h == 1 && isMaximumTimeHalfHour()) break;
        if (i == minimumTimeHour && h == 0 && isMinimumTimeHalfHour()) continue;

        let timeRow = [];
        for (let j = 0; j < dates.length; j++) {
          const dateTime = moment(dates[j].date)
            .hour(i)
            .minute(h == 0 ? 0 : 30)
            .valueOf();

          const isEndOfWeek = moment(dateTime).day() == 0;

          if (flatTimes.includes(dateTime)) {
            timeRow.push(availableTimecell(dateTime, isEndOfWeek));
          } else {
            timeRow.push(disabledTimecell());
          }

          if (
            availabilityInfo[dateTime] &&
            availabilityInfo[dateTime].usersInfo.length > highestAvailableCount
          ) {
            setHighestAvailableCount(
              availabilityInfo[dateTime].usersInfo.length
            );
          }
        }
        if (h == 0) {
          timeCells.push(
            <tr key={i + "00"} className="cursor-pointer">
              <th
                rowSpan={2}
                className="text-right text-dark align-top bg-light sticky left-0 pr-2"
              >
                {i.toString().padStart(2, "0")}:00
              </th>
              {timeRow}
            </tr>
          );
        } else if (h == 1) {
          timeCells.push(
            <tr key={i + "30"} className="cursor-pointer">
              {timeRow}
            </tr>
          );
        }
      }
    }

    return timeCells;
  };

  const availableTimecell = (dateTime: number, isEndOfWeek: boolean) => (
    <td key={dateTime}>
      <div
        data-date={dateTime}
        date-votes={
          availabilityInfo[dateTime]
            ? availabilityInfo[dateTime].usersInfo.length
            : 0
        }
        onMouseDown={() => {
          if ((isMobile() && mobileAnsweringMode) || !isMobile()) {
            toggleTimecell(dateTime);
          } else if (isMobile() && !mobileAnsweringMode) {
            setLookedUpDatetime(dateTime);
            convertDatetimeToDate(dateTime);
          }
          if (!isMobile()) {
            setUnselectMode(false);
            setSelectionMode(true);
            const isTimecellOnline = getSelectedTimecell(dateTime)?.isOnline;
            setOnlineSelectionMode(isTimecellOnline ? true : false);
          }
        }}
        onMouseUp={() => {
          if (!isMobile()) {
            setSelectionMode(false);
            setUnselectMode(false);
          }
        }}
        onMouseOver={() => {
          if (!isMobile()) {
            handleMouseOver(dateTime);
            setLookedUpDatetime(dateTime);
            convertDatetimeToDate(dateTime);
            disableSelection();
          }
        }}
        className={`rounded-lg h-12 w-24 lg:h-6 lg:w-12 transition-colors ${
          isEndOfWeek && "mr-4"
        }  ${
          isDateSelected(dateTime)
            ? `${
                getSelectedTimecell(dateTime)?.isOnline
                  ? `bg-gold ${!isMobile() && "hover:bg-gold/50"}`
                  : `bg-primary ${!isMobile() && "hover:bg-primary/50"}`
              }`
            : `border border-gray ${
                ((isMobile() && !mobileAnsweringMode) || !isMobile()) &&
                "hover:border-none"
              }`
        } ${
          isAnswered(dateTime)
            ? `border-none ${
                isDateSelected(dateTime)
                  ? `${
                      getSelectedTimecell(dateTime)?.isOnline
                        ? "bg-gold hover:bg-gold/50"
                        : "bg-primary hover:bg-primary/50"
                    } selected`
                  : `answered  ${!isMobile() && "active:animate-cell-select"} ${
                      availabilityInfo[dateTime].onlineCount >=
                      highestAvailableCount * 0.5
                        ? "bg-gold-dark hover:bg-gold-dark/50"
                        : availabilityInfo[dateTime].usersInfo.length ==
                          highestAvailableCount
                        ? "bg-green hover:bg-green/50"
                        : "bg-light-green hover:bg-light-green/50"
                    }`
              }`
            : `${
                ((isMobile() && !mobileAnsweringMode) || !isMobile()) &&
                "active:animate-cell-select hover:bg-primary"
              }`
        }`}
      ></div>
    </td>
  );

  const disabledTimecell = () => (
    <td>
      <div className="rounded-lg h-12 w-24 lg:h-6 lg:w-12 bg-light-gray cursor-default"></div>
    </td>
  );

  const isAnswered = (datetime: Number) => {
    const datesData = answers.flatMap((answer: any) => answer.dates);
    const datesArray = datesData.map((date: any) => date.meetDate);
    return datesArray.includes(datetime);
  };

  const daysNaming = ["Nd", "Pon", "Wt", "Śr", "Czw", "Pt", "Sob"];

  const renderDaysHeadings = () => {
    return dates.map((day: any) => (
      <th
        key={moment(day.date).date()}
        className={`bg-light sticky top-0 z-10 ${
          moment(day.date).day() == 0 && "pr-4"
        }`}
      >
        <p className="text-sm text-dark font-medium">
          {moment(day.date).date().toString().padStart(2, "0") +
            "." +
            (moment(day.date).month() + 1).toString().padStart(2, "0")}
        </p>
        <p className="text-dark">{daysNaming[moment(day.date).day()]}</p>
      </th>
    ));
  };

  const renderAvailabilityInfo = () => {
    if (lookedUpDatetime) {
      if (!availabilityInfo[lookedUpDatetime]) {
        return (
          <li className="text-dark">Nikt nie jest dostępny w tym terminie</li>
        );
      } else {
        const dayAvailabilityInfo = availabilityInfo[lookedUpDatetime];
        const availableUsers = dayAvailabilityInfo?.usersInfo.map(
          (userData: any) => userData
        );

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
      if (isMobile()) {
        return <li>Kliknij na godzinę, aby zobaczyć dostępność</li>;
      }
      return <li>Najedź na godzinę, aby zobaczyć dostępność</li>;
    }
  };

  function clearFormData() {
    setUsername("");
    setSelectedTimecells([]);
  }

  const sendAnswer: SubmitHandler<Inputs> = async () => {
    if (username.length > 0) {
      axios
        .post(
          import.meta.env.VITE_SERVER_URL + `/meet/${props.appointmentId}`,
          {
            username: username,
            dates: selectedTimecells,
          }
        )
        .then((res) => {
          clearFormData();
          axios
            .get(
              import.meta.env.VITE_SERVER_URL + `/meet/${props.appointmentId}`
            )
            .then((res) => {
              if (res.status === 200) {
                setAnswers(res.data.answers);
                setMeetName(res.data.meetName);
              }
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  useEffect(() => {
    if (lookedUpDatetime) {
      if (availabilityInfo[lookedUpDatetime]?.usersInfo.length > 0) {
        setAvailableCount(availabilityInfo[lookedUpDatetime]?.usersInfo.length);
      } else setAvailableCount(0);
    } else setAvailableCount(0);
  });

  // Forms
  const formSchema = yup.object().shape({
    name: yup
      .string()
      .required("Twoje imie jest wymagane.")
      .max(20, "Imie może mieć maksymalnie 20 znaków."),
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
    <main className="flex flex-col lg:justify-center p-5 pt-20 lg:p-10 h-screen w-full lg:w-[800px] overflow-hidden">
      <Title text={meetName} />
      <div className="flex flex-1 lg:flex-none justify-end items-center lg:items-start flex-col-reverse lg:justify-start lg:flex-row">
        {((!mobileAnsweringMode && isMobile()) || !isMobile()) && (
          <section className="availability__info w-full lg:w-1/2 lg:mr-10">
            <p>
              {lookedUpDate} {lookedUpTime}
            </p>
            {lookedUpDate ? (
              <Heading text={`${availableCount}/${answersCount}`} />
            ) : (
              ""
            )}

            <ul className="overflow-auto max-h-[100px] h-hd:max-h-[300px]">
              {renderAvailabilityInfo()}
            </ul>
          </section>
        )}

        <section className="flex flex-col time__selection lg:w-1/2">
          {isMobile() && (
            <div className="flex items-center justify-center">
              <span className="text-2xl">✅</span>
              <SwitchButton
                isAnsweringMode={mobileAnsweringMode}
                toggleAnsweringMode={toggleAnsweringMode}
              />
              <span className="text-2xl">📅</span>
            </div>
          )}

          <form
            className="flex flex-1 flex-col place-content-start items-center"
            onSubmit={handleSubmit(sendAnswer)}
          >
            <div className="flex flex-col-reverse lg:flex-col items-center lg:items-start">
              {((mobileAnsweringMode && isMobile()) || !isMobile()) && (
                <div>
                  <Input
                    label="Twoje imie"
                    type="text"
                    id="name"
                    register={register}
                    error={errors.name ? true : false}
                    errorText={errors.name?.message?.toString()}
                    onChange={(e: {
                      target: { value: React.SetStateAction<string> };
                    }) => setUsername(e.target.value)}
                    value={username}
                    placeholder="Twoje imie"
                  />
                </div>
              )}
              <div
                className={`self-center overflow-auto max-h-[250px] h-smd:max-h-[300px] h-md:max-h-[350px] h-mdl:max-h-[400px] h-hd:max-h-[400px] md:h-lg:max-h-[600px] lg:max-h-[500px] w-auto max-w-[360px] md:max-w-[700px] lg:max-w-[350px] mt-5 ${
                  isMobile() && "mb-5"
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
            {((mobileAnsweringMode && isMobile()) || !isMobile()) && (
              <div>
                <Button text="Wyślij" />
                <CopyLinkButton link={currentUrl} className="ml-6" />
              </div>
            )}
          </form>
        </section>
      </div>
    </main>
  );
}
