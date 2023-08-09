import { set } from "mongoose";
import React, { useState } from "react";
import "../assets/css/answerMeeting.css";

export default function AnswerMeeting() {
  // const timecells = document.querySelectorAll(
  //   "#time--cell"
  // ) as NodeListOf<HTMLInputElement>;

  // let isMouseDown = false;
  // let selectionMode = false;

  // timecells.forEach((timecell) => {
  //   timecell.addEventListener("mousedown", () => {
  //     isMouseDown = true;
  //     if (timecell.classList.contains("selected")) {
  //       selectionMode = false;
  //       timecell.classList.remove("selected");
  //     } else {
  //       selectionMode = true;
  //       timecell.classList.add("selected");
  //       getSelectedTimecellsData();
  //     }
  //   });

  //   timecell.addEventListener("mouseup", () => {
  //     isMouseDown = false;
  //   });

  // timecell.addEventListener("mouseover", () => {
  //   if (isMouseDown) {
  //     selectTimecell(timecell, selectionMode);
  //   }
  // });
  // });

  // const selectTimecell = (
  //   timecell: HTMLInputElement,
  //   selectionMode: boolean
  // ) => {
  //   if (selectionMode) {
  //     timecell.classList.add("selected");
  //   } else {
  //     timecell.classList.remove("selected");
  //   }
  // };

  // const getSelectedTimecells = () => {
  //   const selectedTimecells = document.querySelectorAll(
  //     "#time--cell.selected"
  //   ) as NodeListOf<HTMLInputElement>;
  //   return selectedTimecells;
  // };

  // const getSelectedTimecellsData = () => {
  //   const selectedTimecells = getSelectedTimecells();
  //   let selectedTimecellsData: any = [];
  //   selectedTimecells.forEach((selectedTimecell) => {
  //     const dateTime = selectedTimecell.getAttribute("data-date");
  //     const date = new Date(parseInt(dateTime!));
  //     selectedTimecellsData.push(date);
  //   });
  //   return selectedTimecellsData;
  // };

  // const date = new Date();
  // date.setDate(date.getDate() + 1);
  // const date2 = new Date();
  // date2.setDate(date2.getDate() + 2);
  // const date3 = new Date();
  // date3.setDate(date3.getDate() + 3);
  // const date4 = new Date();
  // date4.setDate(date4.getDate() + 4);
  // const days = [date, date2, date3, date4];
  // const time = {
  //   from: 8,
  //   to: 18,
  // };

  // // Days headings
  // let daysHeadings: any = [];
  // days.forEach((day) => {
  //   daysHeadings.push(
  //     <th key={day.getDate()}>{day.getDate() + "." + (day.getMonth() + 1)}</th>
  //   );
  // });

  // // Time rows
  // let daysLen = days.length;
  // let tableRows: any = [];

  // for (let i = time.from; i <= time.to; i++) {
  //   let timeCells: any = [];
  //   for (let j = 0; j < daysLen; j++) {
  //     const dateTime = days[j].setHours(i, 0, 0, 0);
  //     timeCells.push(
  //       <td key={dateTime} data-date={dateTime} id="time--cell"></td>
  //     );
  //   }

  //   tableRows.push(
  //     <tr key={i}>
  //       <th>{i}:00</th>
  //       {timeCells}
  //     </tr>
  //   );
  // }

  const [selectedTimecells, setSelectedTimecells] = useState<number[]>([]);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);

  const date = new Date();
  date.setDate(date.getDate() + 1);
  const date2 = new Date();
  date2.setDate(date2.getDate() + 2);
  const date3 = new Date();
  date3.setDate(date3.getDate() + 3);
  const date4 = new Date();
  date4.setDate(date4.getDate() + 4);
  const days = [date, date2, date3, date4];

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
            onMouseDown={() => toggleTimecell(dateTime)}
            onMouseUp={() => setIsMouseDown(false)}
            onMouseOver={() => handleMouseOver(dateTime)}
            className={selectedTimecells.includes(dateTime) ? "selected" : ""}
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

  const renderDaysHeadings = () => {
    return days.map((day) => (
      <th key={day.getDate()}>{day.getDate() + "." + (day.getMonth() + 1)}</th>
    ));
  };

  return (
    <section className="time__selection">
      <table className="time__seclection--table">
        <thead>
          <tr>
            <th></th>
            {renderDaysHeadings()}
          </tr>
        </thead>
        <tbody>{renderTimeCells()}</tbody>
      </table>
      <button>Przykładowy przycisk</button>
    </section>
  );
}
