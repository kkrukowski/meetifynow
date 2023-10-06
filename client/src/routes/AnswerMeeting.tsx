import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";

import { Button } from "../components/Button";
import Heading from "../components/Heading";
import { Input } from "../components/Input";
import Title from "../components/Title";

export default function AnswerMeeting(props: any) {
  const [selectedTimecells, setSelectedTimecells] = useState<number[]>([]);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [lookedUpDatetime, setLookedUpDatetime] = useState<number>();
  const [lookedUpDate, setLookedUpDate] = useState<string>();
  const [lookedUpTime, setLookedUpTime] = useState<string>();
  const [username, setUsername] = useState("");
  const [availableCount, setAvailableCount] = useState(0);
  const [answers, setAnswers] = useState<any>(props.answers);
  const [meetName, setMeetName] = useState(props.meetName);
  const answeredUsernames = answers.map((answer: any) => answer.username);
  const answersCount = props.answers.length;
  const [highestAvailableCount, setHighestAvailableCount] = useState(0);

  const availabilityInfoNonMerged = answers.flatMap((answer: any) => {
    return answer.dates.map((date: number) => {
      return {
        date: date,
        username: answer.username,
      };
    });
  });

  const availabilityInfo = availabilityInfoNonMerged.reduce(
    (acc: any, curr: any) => {
      if (acc[curr.date]) {
        acc[curr.date].push(curr.username);
      } else {
        acc[curr.date] = [curr.username];
      }
      return acc;
    },
    {}
  );

  const dates = props.dates;
  const days = dates.map((date: string) => new Date(date));

  const toggleTimecell = (dateTime: number) => {
    if (selectedTimecells.includes(dateTime)) {
      if (!selectionMode) {
        setSelectedTimecells(selectedTimecells.filter((dt) => dt !== dateTime));
      }
      if (!isMouseDown) {
        setSelectionMode(false);
        setSelectedTimecells(selectedTimecells.filter((dt) => dt !== dateTime));
        setIsMouseDown(true);
      }
    } else {
      if (selectionMode) {
        setSelectedTimecells([...selectedTimecells, dateTime]);
      }
      if (!isMouseDown) {
        setSelectionMode(true);
        setSelectedTimecells([...selectedTimecells, dateTime]);
        setIsMouseDown(true);
      }
    }
  };

  const handleMouseOver = (dateTime: number) => {
    if (isMouseDown) {
      toggleTimecell(dateTime);
    }
  };

  const convertDatetimeToDate = (datetime: number) => {
    const date = new Date(datetime);
    const convertedDate =
      date.getDate().toString().padStart(2, "0") +
      "." +
      (date.getMonth() + 1).toString().padStart(2, "0") +
      " " +
      daysNaming[date.getDay()];
    const convertedTime =
      date.getHours().toString().padStart(2, "0") +
      ":" +
      date.getMinutes().toString().padStart(2, "0");
    setLookedUpDate(convertedDate);
    setLookedUpTime(convertedTime);
  };

  const renderTimeCells = () => {
    const time = { from: 8, to: 18 };
    var timeCells: any = [];
    var hoursData = [];

    for (let i = time.from; i <= time.to; i++) {
      for (let h = 0; h < 2; h++) {
        let timeRow = [];
        for (let j = 0; j < days.length; j++) {
          const dateTime = days[j].setHours(i, h == 0 ? 0 : 30, 0, 0);

          if (
            availabilityInfo[dateTime] &&
            availabilityInfo[dateTime].length > highestAvailableCount
          ) {
            setHighestAvailableCount(availabilityInfo[dateTime].length);
          }

          timeRow.push(
            <td
              key={dateTime}
              data-date={dateTime}
              date-votes={
                availabilityInfo[dateTime]
                  ? availabilityInfo[dateTime].length
                  : 0
              }
              onMouseDown={() => toggleTimecell(dateTime)}
              onMouseUp={() => setIsMouseDown(false)}
              onMouseOver={() => {
                handleMouseOver(dateTime);
                setLookedUpDatetime(dateTime);
                convertDatetimeToDate(dateTime);
              }}
              className={`rounded-lg h-6 w-12 transition-colors ${
                isAnswered(dateTime)
                  ? `${
                      selectedTimecells.includes(dateTime)
                        ? "bg-primary selected"
                        : `${
                            availabilityInfo[dateTime].length ==
                            highestAvailableCount
                              ? "bg-gold answered hover:bg-primary-hover active:bg-primary-active"
                              : "bg-green answered hover:bg-primary-hover active:bg-primary-active"
                          }`
                    }`
                  : `${
                      selectedTimecells.includes(dateTime)
                        ? "bg-primary selected hover:bg-primary-hover active:bg-primary-active"
                        : "border border-gray hover:border-none hover:bg-primary-hover active:bg-primary-active"
                    }`
              }`}
            ></td>
          );
        }
        if (h == 0) {
          timeCells.push(
            <tr key={i + "00"} className="cursor-pointer">
              <th
                rowSpan={2}
                className="text-right text-dark align-top bg-light sticky left-0"
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

  const isAnswered = (datetime: Number) => {
    return answers.some((answer: any) => answer.dates.includes(datetime));
  };

  const daysNaming = ["Nd", "Pon", "Wt", "Śr", "Czw", "Pt", "Sob"];

  const renderDaysHeadings = () => {
    return days.map((day: Date) => (
      <th key={day.getDate()}>
        <p className="text-sm text-dark font-medium">
          {day.getDate().toString().padStart(2, "0") +
            "." +
            (day.getMonth() + 1).toString().padStart(2, "0")}
        </p>
        <p className="text-dark">{daysNaming[day.getDay()]}</p>
      </th>
    ));
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

  const renderAvailabilityInfo = () => {
    if (lookedUpDatetime) {
      if (!availabilityInfo[lookedUpDatetime]) {
        return (
          <li className="text-dark">Nikt nie jest dostępny w tym terminie</li>
        );
      } else {
        const availableUsernames = availabilityInfo[lookedUpDatetime] || [];
        const unavailableUsernames = answeredUsernames.filter(
          (username: string) => !availableUsernames.includes(username)
        );
        const listOfAvailableUsernames = availableUsernames?.map(
          (username: string) => <li key={username}>{username}</li>
        );
        const listOfUnavailableUsernames = unavailableUsernames?.map(
          (username: string) => (
            <li key={username} className="text-gray">
              <s>{username}</s>
            </li>
          )
        );
        const listOfUsernames = [
          listOfAvailableUsernames,
          listOfUnavailableUsernames,
        ];
        return listOfUsernames;
      }
    } else {
      return <li>Najedź na godzinę, aby zobaczyć dostępność</li>;
    }
  };

  useEffect(() => {
    if (lookedUpDatetime) {
      if (availabilityInfo[lookedUpDatetime]?.length > 0) {
        setAvailableCount(availabilityInfo[lookedUpDatetime]?.length);
      } else setAvailableCount(0);
    } else setAvailableCount(0);
  });

  const formSchema = yup.object().shape({
    name: yup.string().required("Twoje imie jest wymagane."),
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
    <main className="flex flex-col w-[800px]">
      <Title text={meetName} />
      <div className="flex">
        <section className="availability__info w-1/2 mr-10">
          <p>
            {lookedUpDate} {lookedUpTime}
          </p>
          {lookedUpDate ? (
            <Heading text={`${availableCount}/${answersCount}`} />
          ) : (
            ""
          )}

          <ul>{renderAvailabilityInfo()}</ul>
        </section>
        <section className="time__selection w-1/2">
          <form
            className="flex flex-col justify-center items-center"
            onSubmit={handleSubmit(sendAnswer)}
          >
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
              placeholder="Twoje imie"
            />
            {/* https://stackoverflow.com/questions/74158422/thead-background-color-without-border */}
            <div className="overflow-auto h-full max-h-[500px] w-full max-w-[500px] mt-5">
              <table className="time__seclection--table w-fit mt-5 border-separate self-center overflow-auto">
                <thead className="sticky bg-light top-0 z-10">
                  <tr>
                    <th></th>
                    {renderDaysHeadings()}
                  </tr>
                </thead>
                <tbody>{renderTimeCells()}</tbody>
              </table>
            </div>
            <Button text="Wyślij" />
          </form>
        </section>
      </div>
    </main>
  );
}
