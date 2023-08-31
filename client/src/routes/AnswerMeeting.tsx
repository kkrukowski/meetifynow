import axios from "axios";
import React, { useEffect, useState } from "react";

import { Input } from "../components/Input";

import "../assets/css/answerMeeting.css";

export default function AnswerMeeting(props: any) {
  const [selectedTimecells, setSelectedTimecells] = useState<number[]>([]);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [username, setUsername] = useState("");
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
            onMouseOver={() => handleMouseOver(dateTime)}
            className={`${isAnswered(dateTime) ? "answered" : ""} ${
              selectedTimecells.includes(dateTime) ? "selected" : ""
            }`}
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

  return (
    <section className="time__selection">
      <form>
        <Input
          label="name"
          type="text"
          id="name"
          onChange={(e: { target: { value: React.SetStateAction<string> } }) =>
            setUsername(e.target.value)
          }
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
  );
}
