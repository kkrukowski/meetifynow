import { useTranslations } from "next-intl";
import Image from "next/image";
import { useTranslation } from "react-i18next";
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
  const { t, i18n } = useTranslation();

  const InfoBlockData = [
    {
      img: FastImg,
      img_alt: "Illustration of a rocket",
      img_title: "Rocket Illustration",
      title: t("homePage.infoBlock.fast.title"),
      text: t("homePage.infoBlock.fast.text"),
      reverse: false,
    },
    {
      img: TeamImg,
      img_alt: "Illustration of a team",
      img_title: "Team Illustration",
      title: t("homePage.infoBlock.everyone.title"),
      text: t("homePage.infoBlock.everyone.text"),
      reverse: true,
    },
    {
      img: WaitImg,
      img_alt: "Illustration of a clock",
      img_title: "Clock Illustration",
      title: t("homePage.infoBlock.time.title"),
      text: t("homePage.infoBlock.time.text"),
      reverse: false,
    },
    {
      img: OnlineMeetImg,
      img_alt: "Illustration of a video call",
      img_title: "Video Call Illustration",
      title: t("homePage.infoBlock.online.title"),
      text: t("homePage.infoBlock.online.text"),
      reverse: true,
    },
    {
      img: GroupImg,
      img_alt: "Illustration of a group of people",
      img_title: "Group Illustration",
      title: t("homePage.infoBlock.flexibleHours.title"),
      text: t("homePage.infoBlock.flexibleHours.text"),
      reverse: false,
    },
  ];

  return (
    <main className="w-full md:max-w-3xl lg:max-w-5xl p-10 pt-20 lg:p-20 lg:pt-28 h-smd:pt-20 flex flex-col items-center">
      <header className="flex flex-col items-center sm:flex-row mt-10 mb-20 md:my-40">
        <div className="flex flex-col items-center lg:items-start sm:w-auto lg:w-1/2">
          <Title text={t("homePage.title")} />
          <p className="mb-5 text-lg text-dark text-justify">
            {t("homePage.headerText")}
          </p>
          <Link to="/meet/new">
            <Button text={t("homePage.createButton")} />
          </Link>
        </div>

        <Image
          src={CalendarImg}
          alt="Illustration of a calendar"
          title="Calendar Illustration"
          className="m-0 mt-20 sm:mt-0 sm:ml-10 w-auto sm:w-auto lg:w-1/2 h-48 md:h-64 lg:h-auto"
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
