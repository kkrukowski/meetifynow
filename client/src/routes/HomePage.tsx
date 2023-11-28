import { Link } from "react-router-dom";

import Button from "../components/Button";
import InfoBlock from "../components/HomePage/InfoBlock";
import Title from "../components/Title";

// Images
import CalendarImg from "../assets/imgs/calendar.webp";
import FastImg from "../assets/imgs/fast.webp";
import GroupImg from "../assets/imgs/group-meet.webp";
import OnlineMeetImg from "../assets/imgs/online-meet.webp";
import TeamImg from "../assets/imgs/team.webp";
import WaitImg from "../assets/imgs/wait.webp";

export default function HomePage() {
  const InfoBlockData = [
    {
      img: FastImg,
      img_alt: "Illustration of a rocket",
      img_title: "Rocket Illustration",
      title: "Szybkie i łatwe",
      text: "MeetifyNow to Twój sposób na szybkie i łatwe planowanie spotkań! Stworzysz je w kilka sekund. Nasza aplikacja zapewnia łatwość obsługi i uczyni organizację spotkań przyjemnością.",
      reverse: false,
    },
    {
      img: TeamImg,
      img_alt: "Illustration of a team",
      img_title: "Team Illustration",
      title: "Dla każdego",
      text: "Niezależnie od tego, czy organizujesz spotkanie biznesowe, czy towarzyskie, skorzystaj z MeetifyNow i ciesz się szybkim, prostym i przyjemnym procesem planowania!",
      reverse: true,
    },
    {
      img: WaitImg,
      img_alt: "Illustration of a clock",
      img_title: "Clock Illustration",
      title: "Oszczędź czas na logowanie",
      text: "Z MeetifyNow planowanie spotkań staje się jeszcze łatwiejsze — możesz to robić bez konieczności logowania! Oszczędź cenny czas i błyskawicznie zaplanuj swoje spotkania!",
      reverse: false,
    },
    {
      img: OnlineMeetImg,
      img_alt: "Illustration of a video call",
      img_title: "Video Call Illustration",
      title: "Wybór dostępności online",
      text: "Nasza aplikacja umożliwia wybór dostępności na spotkaniu, nawet jeśli jesteś dostępny tylko zdalnie! W pełni dostosuj harmonogram spotkania do swoich potrzeb.",
      reverse: true,
    },
    {
      img: GroupImg,
      img_alt: "Illustration of a group of people",
      img_title: "Group Illustration",
      title: "Niestandardowe godziny",
      text: "Nie bądź ograniczony standardowymi przedziałami godzin! MeetifyNow pozwala na tworzenie spotkań według dowolnych godzin, dostosowując się do Twojego indywidualnego grafiku.",
      reverse: false,
    },
  ];

  return (
    <main className="w-full md:max-w-3xl lg:max-w-5xl p-10 pt-20 lg:p-20 lg:pt-28 h-smd:pt-20 flex flex-col items-center">
      <header className="flex flex-col items-center sm:flex-row mt-10 mb-20 md:my-40">
        <div className="flex flex-col items-center lg:items-start">
          <Title text="Planowanie spotkań nigdy nie było prostsze!" />
          <p className="mb-5 text-lg text-dark text-justify">
            MeetifyNow to łatwa w obsłudze platforma do planowania spotkań bez
            potrzeby logowania.
          </p>
          <Link to="/meet/new">
            <Button text="Utwórz spotkanie" />
          </Link>
        </div>
        <img
          src={CalendarImg}
          alt="Illustration of a calendar"
          title="Calendar Illustration"
          className="m-0 mt-20 sm:mt-0 sm:ml-10 h-64 sm:w-auto lg:w-1/2 h-48 md:h-64 lg:h-auto"
        />
      </header>
      <div>
        {InfoBlockData.map((item) => (
          <InfoBlock
            key={item.title}
            img={item.img}
            img_alt={item.img_alt}
            img_title={item.img_title}
            title={item.title}
            text={item.text}
            reverse={item.reverse}
          />
        ))}
      </div>
    </main>
  );
}
