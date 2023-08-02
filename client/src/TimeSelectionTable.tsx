import { query } from "express";
import { set } from "mongoose";
import React, { Component, useState } from "react";
import "./timeSelectionTable.css";

class TimeSelectionTable extends Component {
  componentDidMount(): void {
    const timecells = document.querySelectorAll(
      "#time--cell"
    ) as NodeListOf<HTMLInputElement>;

    let isMouseDown = false;
    let selectionMode = false;

    timecells.forEach((timecell) => {
      timecell.addEventListener("mousedown", () => {
        isMouseDown = true;
        if (timecell.classList.contains("selected")) {
          selectionMode = false;
          timecell.classList.remove("selected");
        } else {
          selectionMode = true;
          timecell.classList.add("selected");
        }
      });

      timecell.addEventListener("mouseup", () => {
        isMouseDown = false;
      });

      timecell.addEventListener("mouseover", () => {
        if (isMouseDown) {
          selectTimecell(timecell, selectionMode);
        }
      });
    });

    const selectTimecell = (
      timecell: HTMLInputElement,
      selectionMode: boolean
    ) => {
      if (selectionMode) {
        timecell.classList.add("selected");
      } else {
        timecell.classList.remove("selected");
      }
    };

    const getSelectedTimecells = () => {
      const selectedTimecells = document.querySelectorAll(
        "#time--cell.selected"
      ) as NodeListOf<HTMLInputElement>;
      return selectedTimecells;
    };
  }

  render() {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    const date2 = new Date();
    date2.setDate(date2.getDate() + 2);
    const date3 = new Date();
    date3.setDate(date3.getDate() + 3);
    const date4 = new Date();
    date4.setDate(date4.getDate() + 4);
    const days = [date, date2, date3, date4];
    const time = {
      from: 8,
      to: 9,
    };

    // Days headings
    let daysHeadings: any = [];
    days.forEach((day) => {
      daysHeadings.push(
        <th key={day.getDate()}>
          {day.getDate() + "." + (day.getMonth() + 1)}
        </th>
      );
    });

    // Time rows
    let daysLen = days.length;
    let tableRows: any = [];

    for (let i = time.from; i <= time.to; i++) {
      let timeCells: any = [];
      for (let j = 0; j < daysLen; j++) {
        const dateTime = days[j].setHours(i, 0, 0, 0);
        console.log(dateTime);
        timeCells.push(<td key={dateTime} id="time--cell"></td>);
      }

      tableRows.push(
        <tr key={i}>
          <th>{i}:00</th>
          {timeCells}
        </tr>
      );
    }

    return (
      <table className="time__seclection--table">
        <thead>
          <tr>
            <th></th>
            {daysHeadings}
          </tr>
        </thead>
        <tbody>{tableRows}</tbody>
      </table>
    );
  }
}

export default TimeSelectionTable;
