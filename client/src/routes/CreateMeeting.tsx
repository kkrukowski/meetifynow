import { set } from "mongoose";
import React, { useState } from "react";

import axios from "axios";

import "../assets/css/createMeeting.css";

export default function CreateMeeting() {
  // Name
  const [meetingName, setMeetingName] = useState("");

  // Time
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("09:00");

  const handleStartTimeChange = (e: { target: { value: string } }) => {
    const input = document.getElementById("startTime") as HTMLInputElement;
    setStartTime(e.target.value);
    input.value = e.target.value;
    console.log("Start: " + startTime);
  };

  const handleEndTimeChange = (e: { target: { value: string } }) => {
    setEndTime(e.target.value);
    console.log("End: " + endTime);
  };

  // CALENDAR
  // Selecting dates
  const [selectedDates, setSelectedDates] = useState<number[]>([]);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);

  const toggleTimecell = (date: number) => {
    if (selectedDates.includes(date)) {
      if (!selectionMode) {
        setSelectedDates(selectedDates.filter((d) => d !== date));
      }
      if (!isMouseDown) {
        setSelectionMode(false);
        setSelectedDates(selectedDates.filter((d) => d !== date));
        setIsMouseDown(true);
      }
    } else {
      if (selectionMode) {
        setSelectedDates([...selectedDates, date]);
      }
      if (!isMouseDown) {
        setSelectionMode(true);
        setSelectedDates([...selectedDates, date]);
        setIsMouseDown(true);
      }
    }
  };

  const handleMouseOver = (date: number) => {
    if (isMouseDown) {
      toggleTimecell(date);
    }
  };

  // Rendering calerdar
  const showCalendar = (month: number, year: number) => {
    console.log(month, year);

    const firstDay = new Date(year, month).getDay() - 1;
    const daysInMonth = 32 - new Date(year, month, 32).getDate();
    const weeksInCalendar = Math.ceil((daysInMonth + firstDay) / 7);

    let tableRows = [];
    let day = 1;
    let e = 0;

    for (let i = 0; i < weeksInCalendar; i++) {
      let tableCells = [];
      for (let j = 0; j < 7; j++) {
        const date = new Date(year, month, day);
        if (day <= daysInMonth && (i > 0 || j >= firstDay)) {
          tableCells.push(
            <td
              key={"d" + day}
              data-date={+date}
              onMouseDown={() => toggleTimecell(+date)}
              onMouseUp={() => setIsMouseDown(false)}
              onMouseOver={() => handleMouseOver(+date)}
              className={`h-10 w-10 font-medium text-center ${
                selectedDates.includes(+date)
                  ? "bg-primary rounded-lg text-light selected"
                  : ""
              }`}
            >
              {day}
            </td>
          );
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

  const currentDate = new Date();
  const [month, setMonth] = useState(currentDate.getMonth());
  const [year, setYear] = useState(currentDate.getFullYear());

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

  const monthName = [
    "Styczeń",
    "Luty",
    "Marzec",
    "Kwiecień",
    "Maj",
    "Czerwiec",
    "Lipiec",
    "Sierpień",
    "Wrzesień",
    "Pażdziernik",
    "Listopad",
    "Grudzień",
  ];

  // Create meeting
  const createMeeting = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/meet/new", {
        meetName: meetingName,
        dates: selectedDates,
        startTime: startTime,
        endTime: endTime,
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error.response.data.message);
        console.log(error);
      });
  };

  return (
    <section className="flex flex-col justify-center">
      <h1 className="text-4xl font-bold mb-10">Utwórz nowe spotkanie</h1>
      <form id="create-meeting-form" className="flex flex-col justify-center">
        {/* Meeting name input */}
        <input
          type="text"
          placeholder="Nazwa spotkania"
          onChange={(e) => setMeetingName(e.target.value)}
          required
        />
        {/* Choose date */}
        <div className="flex justify-center">
          <div>
            <h3>Wybierz dni</h3>
            <table className="date__selection--table border-separate border-spacing-0.5">
              <thead>
                <tr>
                  <th colSpan={7}>
                    <div className="flex justify-between items-center">
                      <button
                        onClick={prevMonth}
                        className="h-10 w-10 rounded-lg bg-light hover:bg-light-hover active:bg-light-active shadow-md transition-colors"
                      >
                        &lt;
                      </button>
                      <span>{monthName[month] + " " + year}</span>
                      <button
                        onClick={nextMonth}
                        className="h-10 w-10 rounded-lg bg-light hover:bg-light-hover active:bg-light-active shadow-md transition-colors"
                      >
                        &gt;
                      </button>
                    </div>
                  </th>
                </tr>
                <tr>
                  <th className="font-medium text-gray">Pon</th>
                  <th className="font-medium text-gray">Wt</th>
                  <th className="font-medium text-gray">Śr</th>
                  <th className="font-medium text-gray">Czw</th>
                  <th className="font-medium text-gray">Pt</th>
                  <th className="font-medium text-gray">Sb</th>
                  <th className="font-medium text-gray">Nd</th>
                </tr>
              </thead>
              <tbody>{showCalendar(month, year)}</tbody>
            </table>
          </div>
          <div>
            <h3>Wybierz przedział godzin</h3>
            <input
              type="time"
              id="startTime"
              value={startTime}
              required
              onChange={handleStartTimeChange}
            />
            <span> -&gt; </span>
            <input
              type="time"
              id="endTime"
              value={endTime}
              required
              onChange={handleEndTimeChange}
            />
          </div>
        </div>
        <button
          className="bg-primary hover:bg-primary-hover active:bg-primary-active text-light font-medium w-fit px-4 py-2 rounded-lg mt-5 self-center transition-colors"
          onClick={createMeeting}
        >
          Utwórz spotkanie
        </button>
      </form>
    </section>
  );
}
