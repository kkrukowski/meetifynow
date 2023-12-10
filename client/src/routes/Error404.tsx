import { useTranslation } from "react-i18next";
import { Locale } from "../../i18n.config";
import { getDictionary } from "../lib/dictionary";

import BigText from "../components/BigText";
import Button from "../components/Button";
import Heading from "../components/Heading";

import { Link } from "react-router-dom";

export default async function Error404({ lang }: { lang: Locale }) {
  const { t } = useTranslation();
  const dict = await getDictionary(lang);

  return (
    <div className="flex flex-1 flex-col justify-center items-center h-full">
      <BigText text="404" />
      <Heading text={dict.products.cart} />
      <Link to="/">
        <Button text={t("button.homePage")} />
      </Link>
    </div>
  );
}
