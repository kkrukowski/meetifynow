import { useTranslation } from "react-i18next";

import BigText from "../components/BigText";
import Button from "../components/Button";
import Heading from "../components/Heading";

import { Link } from "react-router-dom";

export default function Error404() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col justify-center items-center h-full">
      <BigText text="404" />
      <Heading text={t("errorPage.title")} />
      <Link to="/">
        <Button text={t("button.homePage")} />
      </Link>
    </div>
  );
}
