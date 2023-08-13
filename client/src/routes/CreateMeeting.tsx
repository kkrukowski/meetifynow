import { set } from "mongoose";
import React, { useState } from "react";
import "../assets/css/createMeeting.css";

export default function CreateMeeting() {
  // Name
  const [meetingName, setMeetingName] = useState("");

  // CALENDAR
  // Selecting dates
  const [selectedDates, setSelectedDates] = useState<number[]>([]);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);

  console.log(selectedDates);

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
              className={selectedDates.includes(+date) ? "selected" : ""}
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

  return (
    <section>
      <h1>Utwórz nowe spotkanie</h1>
      <form id="create-meeting-form">
        <h3>Nazwij spotkanie</h3>
        <input
          type="text"
          placeholder="Meeting name"
          onChange={(e) => setMeetingName(e.target.value)}
        />
        <div>
          <h3>Wybierz dni</h3>
          <table className="date__selection--table">
            <thead>
              <tr>
                <th colSpan={7}>
                  {monthName[month]} {year}
                </th>
              </tr>
              <tr>
                <th>Pon</th>
                <th>Wt</th>
                <th>Śr</th>
                <th>Czw</th>
                <th>Pt</th>
                <th>Sb</th>
                <th>Nd</th>
              </tr>
            </thead>
            <tbody>{showCalendar(month, year)}</tbody>
            <tbody>
              <tr>
                <td colSpan={7}>
                  <button onClick={prevMonth}>{monthName[month - 1]}</button>
                  <button onClick={nextMonth}>{monthName[month + 1]}</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div>
          <h3>Wybierz przedział godzin</h3>
        </div>
      </form>
    </section>
  );
}
