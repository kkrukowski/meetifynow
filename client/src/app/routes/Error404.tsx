import { Locale } from "../../../i18n.config";

import BigText from "../components/BigText";
import Button from "../components/Button";
import Heading from "../components/Heading";

import Link from "next/link";

export default async function Error404({
  lang,
  dict,
}: {
  lang: Locale;
  dict: any;
}) {
  return (
    <div className="flex flex-1 flex-col justify-center items-center h-full">
      <BigText text={dict.page.error[404].heading} />
      <Heading text={dict.page.error[404].title} />
      <Link href={`/${lang}`}>
        <Button text={dict.button.homePage} />
      </Link>
    </div>
  );
}
