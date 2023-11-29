import { useTranslation } from "react-i18next";

import { Link } from "react-router-dom";
import Button from "../components/Button";
import Heading from "../components/Heading";
import Title from "../components/Title";

export default function AnswetNotFound() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col justify-center items-center h-full mt-20 mx-10 lg:m-0">
      <Title text={t("answerNotFoundPage.title")} />
      <Heading text={t("answerNotFoundPage.heading")} />
      <Link to="/meet/new">
        <Button text={t("button.createMeeting")} />
      </Link>
    </div>
  );
}
