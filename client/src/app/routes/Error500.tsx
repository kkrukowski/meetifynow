import { Locale } from "../../../i18n.config";
import { getDictionary } from "../lib/dictionary";

import BigText from "../components/BigText";
import Button from "../components/Button";
import Heading from "../components/Heading";

import { Link } from "react-router-dom";

export default async function Error500() {
  const dict = await getDictionary("en");

  return (
    <div className="flex flex-1 flex-col justify-center items-center h-full">
      <BigText text={dict.page.error[500].heading} />
      <Heading text={dict.page.error[500].title} />
      <Link to="/">
        <Button text={dict.button.homePage} />
      </Link>
    </div>
  );
}
