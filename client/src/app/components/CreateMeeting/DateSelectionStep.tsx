import { generateShortDaysNames } from "@/utils/meeting/TimeFunctions";
import { motion } from "framer-motion";
import _ from "lodash";
import moment from "moment";
import React, { useState } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

interface DateSelectionStepProps {
  delta: number;
  selectedDates: number[];
  setSelectedDates: (dates: number[]) => void;
  dateError: boolean;
  dateErrorText: string;
}

const DateSelectionStep: React.FC<DateSelectionStepProps> = ({
  delta,
  selectedDates,
  setSelectedDates,
  dateError,
  dateErrorText,
}) => {
  const [month, setMonth] = useState(moment().month());
  const [year, setYear] = useState(moment().year());
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [selectionMode, setSelectionMode] = useState<boolean | null>(null);

  const toggleTimecell = (dateTime: number) => {
    const isSelected = selectedDates.includes(dateTime);
    if (isMouseDown) {
      if (selectionMode === null) {
        setSelectionMode(!isSelected);
        if (!isSelected) {
          setSelectedDates([...selectedDates, dateTime]);
        } else {
          setSelectedDates(selectedDates.filter((d) => d !== dateTime));
        }
      } else {
        if (selectionMode && !isSelected) {
          setSelectedDates([...selectedDates, dateTime]);
        } else if (!selectionMode && isSelected) {
          setSelectedDates(selectedDates.filter((d) => d !== dateTime));
        }
      }
    }
  };

  const handleMouseDown = (dateTime: number) => {
    setIsMouseDown(true);
    const isSelected = selectedDates.includes(dateTime);
    setSelectionMode(!isSelected);
    if (!isSelected) {
      setSelectedDates([...selectedDates, dateTime]);
    } else {
      setSelectedDates(selectedDates.filter((d) => d !== dateTime));
    }
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
    setSelectionMode(null);
  };

  const showCalendar = (m: number, y: number) => {
    // ... (cała logika renderowania kalendarza z oryginalnego pliku)
    var firstDay = new Date(y, m, 1).getDay();
    if (firstDay === 0) firstDay = 7;
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const weeksInMonth = Math.ceil((daysInMonth + firstDay - 1) / 7);
    let day = 1;
    let tableRows = [];

    for (let i = 0; i < weeksInMonth; i++) {
      let tableCells = [];
      for (let j = 0; j < 7; j++) {
        if ((i === 0 && j < firstDay - 1) || day > daysInMonth) {
          tableCells.push(<td key={`${i}-${j}`}></td>);
        } else {
          const date = moment().year(y).month(m).date(day);
          const dateTime = date.startOf("day").valueOf();
          const isPast = dateTime < moment().subtract(1, "days").valueOf();
          const isToday = moment().isSame(date, "day");
          const isSelected = selectedDates.includes(dateTime);

          tableCells.push(
            <td
              key={dateTime}
              onMouseDown={() => !isPast && handleMouseDown(dateTime)}
              onMouseOver={() => !isPast && toggleTimecell(dateTime)}
              className={`h-10 w-10 font-medium text-center ${
                isPast ? "text-gray" : "cursor-pointer"
              } ${isSelected ? "bg-primary text-light rounded-lg" : ""} ${
                isToday && !isSelected
                  ? "border-2 border-primary rounded-lg"
                  : ""
              }`}
            >
              {day}
            </td>
          );
          day++;
        }
      }
      tableRows.push(
        <tr key={i} onMouseUp={handleMouseUp}>
          {tableCells}
        </tr>
      );
    }
    return tableRows;
  };

  const prevMonth = () =>
    month === 0 ? (setMonth(11), setYear(year - 1)) : setMonth(month - 1);
  const nextMonth = () =>
    month === 11 ? (setMonth(0), setYear(year + 1)) : setMonth(month + 1);
  const shortDaysNames = generateShortDaysNames();

  return (
    <motion.div
      initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      onMouseUp={handleMouseUp}
    >
      <div className="flex flex-col self-center">
        <table
          className={`date__selection--table border-separate border-spacing-0.5 box-content p-2 select-none w-[296px] ${
            dateError ? "rounded-lg border-2 border-red" : "border-transparent"
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
                    {_.capitalize(moment().month(month).format("MMMM"))} {year}
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
                <th key={day} className="font-medium text-gray">
                  {day}
                </th>
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
  );
};

export default DateSelectionStep;
