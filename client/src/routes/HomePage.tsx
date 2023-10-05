import CalendarImg from "../assets/imgs/calendar.svg";
import { Button } from "../components/Button";
import Title from "../components/Title";

export default function HomePage() {
  return (
    <main className="w-full max-w-5xl flex items-center">
      <div>
        <Title text="Planowanie spotkań nigdy nie było prostsze!" />
        <p className="mb-5 text-dark">
          time2meet to platforma do planowania spotkań niewymagająca logowania
        </p>
        <a href="/meet/new">
          <Button text="Utwórz spotkanie" />
        </a>
      </div>
      <img src={CalendarImg} alt="Calendar" className="ml-10 w-1/2 h-full" />
    </main>
  );
}
