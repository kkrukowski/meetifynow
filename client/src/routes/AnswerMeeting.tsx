import axios from "axios";
import React, { useEffect, useState } from "react";

import { Input } from "../components/Input";

import { set } from "mongoose";
import "../assets/css/answerMeeting.css";

export default function AnswerMeeting(props: any) {
  const [selectedTimecells, setSelectedTimecells] = useState<number[]>([]);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [lookedUpDatetime, setLookedUpDatetime] = useState<number>();
  const [lookedUpDate, setLookedUpDate] = useState<string>();
  const [lookedUpTime, setLookedUpTime] = useState<string>();
  const [username, setUsername] = useState("");
  const [availableCount, setAvailableCount] = useState(0);
  const answers = props.answers;

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

  console.log(availabilityInfo);
  console.log(answers);

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
    const convertedDate = date.getDate() + "." + (date.getMonth() + 1);
    const convertedTime = date.getHours() + ":00";
    setLookedUpDate(convertedDate);
    setLookedUpTime(convertedTime);
  };

  const renderTimeCells = () => {
    const time = { from: 8, to: 18 };
    const timeCells = [];

    for (let i = time.from; i <= time.to; i++) {
      const timeRow = [];
      for (let j = 0; j < days.length; j++) {
        const dateTime: number = days[j].setHours(i, 0, 0, 0);
        timeRow.push(
          <td
            key={dateTime}
            data-date={dateTime}
            date-votes={
              availabilityInfo[dateTime] ? availabilityInfo[dateTime].length : 0
            }
            onMouseDown={() => toggleTimecell(dateTime)}
            onMouseUp={() => setIsMouseDown(false)}
            onMouseOver={() => {
              handleMouseOver(dateTime);
              setLookedUpDatetime(dateTime);
              convertDatetimeToDate(dateTime);
            }}
            className={`${isAnswered(dateTime) ? "answered" : ""} ${
              selectedTimecells.includes(dateTime) ? "selected" : ""
            } "rounded"`}
          ></td>
        );
      }

      timeCells.push(
        <tr key={i}>
          <th>{i}:00</th>
          {timeRow}
        </tr>
      );
    }

    return timeCells;
  };

  const isAnswered = (datetime: Number) => {
    return answers.some((answer: any) => answer.dates.includes(datetime));
  };

  const renderDaysHeadings = () => {
    return days.map((day: Date) => (
      <th key={day.getDate()}>{day.getDate() + "." + (day.getMonth() + 1)}</th>
    ));
  };

  const sendAnswer = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

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
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const renderAvailabilityInfo = () => {
    if (lookedUpDatetime) {
      if (!availabilityInfo[lookedUpDatetime]) {
        return <li>Nikt nie jest dostępny w tym terminie</li>;
      } else {
        return availabilityInfo[lookedUpDatetime]?.map((username: string) => (
          <li key={username}>{username}</li>
        ));
      }
    } else {
      return <li>Najedź na godzinę, aby zobaczyć dostępność</li>;
    }
  };

  useEffect(() => {
    if (lookedUpDatetime) {
      if (availabilityInfo[lookedUpDatetime]?.length > 0)
        setAvailableCount(availabilityInfo[lookedUpDatetime]?.length);
      else setAvailableCount(0);
    } else setAvailableCount(0);
  });

  return (
    <main className="flex w-[800px]">
      <section className="availability__info w-1/2 mr-10">
        <h3>
          {availableCount}/{answers.length}
        </h3>
        <h3>
          {lookedUpDate} {lookedUpTime}
        </h3>
        <ul>{renderAvailabilityInfo()}</ul>
      </section>
      <section className="time__selection w-1/2">
        <form>
          <Input
            label="name"
            type="text"
            id="name"
            onChange={(e: {
              target: { value: React.SetStateAction<string> };
            }) => setUsername(e.target.value)}
            placeholder="Twoja nazwa"
          />
          <table className="time__seclection--table">
            <thead>
              <tr>
                <th></th>
                {renderDaysHeadings()}
              </tr>
            </thead>
            <tbody>{renderTimeCells()}</tbody>
          </table>
          <button onClick={sendAnswer}>Przykładowy przycisk</button>
        </form>
      </section>
    </main>
  );
}
