import BigText from "@/components/BigText";
import Button from "@/components/Button";
import Heading from "@/components/Heading";
import { getDictionary } from "@/lib/dictionary";

import { Locale } from "@root/i18n.config";
import Link from "next/link";

export default async function Error500() {
  const lang = "en" as Locale;
  const dict = await getDictionary(lang);

  return (
    <div className="flex flex-1 flex-col justify-center items-center h-full">
      <BigText text={dict.page.error[500].heading} />
      <Heading text={dict.page.error[500].title} />
      <Link href={`/${lang}`}>
        <Button text={dict.button.homePage} />
      </Link>
    </div>
  );
}
