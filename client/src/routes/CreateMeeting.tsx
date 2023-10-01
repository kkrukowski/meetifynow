import { yupResolver } from "@hookform/resolvers/yup";
import { set } from "mongoose";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import * as yup from "yup";

// Components
import { Button } from "../components/Button";
import Heading from "../components/Heading";
import { Input } from "../components/Input";
import { Timepicker } from "../components/Timepicker";
import Title from "../components/Title";

import axios from "axios";

import "../assets/css/createMeeting.css";

export default function CreateMeeting() {
  // Name
  const [meetingName, setMeetingName] = useState("");

  // Time
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("09:00");
  const [timeError, setTimeError] = useState(false);
  const [timeErrorText, setTimeErrorText] = useState("");

  const handleStartTimeChange = (e: { target: { value: string } }) => {
    setStartTime(e.target.value);
  };

  const handleEndTimeChange = (e: { target: { value: string } }) => {
    setEndTime(e.target.value);
  };

  // CALENDAR
  // Selecting dates
  const [selectedDates, setSelectedDates] = useState<number[]>([]);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [dateError, setDateError] = useState(false);

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

  const daysName = ["Pon", "Wt", "Śr", "Czw", "Pt", "Sob", "Nd"];

  // Create meeting
  const createMeeting: SubmitHandler<Inputs> = async () => {
    validateTime();
    validateDate();
    if (validateTime() && validateDate()) {
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
    }
  };

  // VALIDATION
  // Date validation
  const validateDate = () => {
    if (selectedDates.length < 1) {
      setDateError(true);
      return false;
    } else {
      setDateError(false);
      return true;
    }
  };

  // Time validation
  const validateTime = () => {
    const now = new Date();
    const nowDateTime = now.toISOString();
    const nowDate = nowDateTime.split("T")[0];
    const startTimeConverted = new Date(nowDate + "T" + startTime);
    const endTimeConverted = new Date(nowDate + "T" + endTime);

    console.log(
      startTimeConverted,
      endTimeConverted,
      startTimeConverted >= endTimeConverted
    );
    if (startTimeConverted >= endTimeConverted) {
      setTimeError(true);
      setTimeErrorText(
        "Godzina zakończenia musi być późniejsza niż rozpoczęcia."
      );
      return false;
    } else {
      setTimeError(false);
      setTimeErrorText("");
      return true;
    }
  };

  // Form validation
  const formSchema = yup.object().shape({
    meeting__name: yup
      .string()
      .required("Nazwa spotkania jest wymagana.")
      .min(4, "Nazwa spotkania musi mieć co najmniej 4 znaki."),
  });

  type Inputs = {
    meeting__name: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(formSchema) });

  return (
    <main className="flex flex-col justify-center">
      <Title text="Utwórz nowe spotkanie" />
      <form
        id="create-meeting-form"
        className="flex flex-col justify-center"
        onSubmit={handleSubmit(createMeeting)}
      >
        {/* Meeting name input */}
        <Input
          label="Nazwa spotkania"
          type="text"
          id="meeting__name"
          register={register}
          errorText={errors.meeting__name?.message?.toString()}
          error={errors.meeting__name ? true : false}
          placeholder="📝 Nazwa spotkania"
          onChange={(e: { target: { value: React.SetStateAction<string> } }) =>
            setMeetingName(e.target.value)
          }
        />
        {/* Choose date */}
        <div className="flex flex-col justify-center my-5">
          <Heading text="📅 Wybierz datę i czas spotkania" />
          <div className="flex">
            <div>
              <table
                className={`date__selection--table border border-2 border-separate border-spacing-0.5 box-content p-2 ${
                  dateError ? "rounded-lg border-red" : "border-transparent"
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
                        <span>{monthName[month] + " " + year}</span>
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
                    {daysName.map((day) => (
                      <th className="font-medium text-gray">{day}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>{showCalendar(month, year)}</tbody>
              </table>
            </div>
            <div className="w-px bg-gray rounded-lg mx-14"></div>
            <div className="flex flex-col justify-center items-center w-fit">
              <div className="self-center">
                <Timepicker from={true} onChange={handleStartTimeChange} />
                <span className="m-4"> - </span>
                <Timepicker from={false} onChange={handleEndTimeChange} />
              </div>
            </div>
          </div>
        </div>
        <p className="text-sm relative mt-2 text-red font-medium">
          {dateError ? "Wybierz datę spotkania." : ""}
        </p>
        <p className="text-sm relative mt-2 text-red font-medium w-11/12 whitespace-pre-wrap">
          {timeError ? timeErrorText : ""}
        </p>
        <Button text="Utwórz spotkanie" />
      </form>
    </main>
  );
}
