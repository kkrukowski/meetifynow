import React from "react";
import CalendarImg from "../assets/imgs/calendar.webp";
import Button from "../components/Button";
import Title from "../components/Title";

export default function HomePage() {
  return (
    <main className="w-full flex-1 h-full md:max-w-xl lg:max-w-5xl p-5 pt-20 lg:p-20 lg:pt-28 h-smd:pt-20 flex flex-col lg:flex-row items-center">
      <div className="flex flex-col items-center lg:items-start">
        <Title text="Planowanie spotkań nigdy nie było prostsze!" />
        <p className="mb-5 text-dark">
          MeetifyNow to platforma do prostego planowania spotkań niewymagająca
          logowania
        </p>
        <a href="/meet/new">
          <Button text="Utwórz spotkanie" />
        </a>
      </div>
      <img
        src={CalendarImg}
        alt="Calendar"
        className="m-0 mt-10 lg:mt-0 lg:ml-10 lg:w-1/2 h-48 md:h-64 lg:h-auto"
      />
    </main>
  );
}
