import { Locale } from "../../i18n.config";
import { getDictionary } from "../app/lib/dictionary";

import { Link } from "react-router-dom";
import Button from "../app/components/Button";
import Heading from "../app/components/Heading";
import Title from "../app/components/Title";

export default async function AnswetNotFound({ lang }: { lang: Locale }) {
  // Translation
  const dict = await getDictionary(lang);
  return (
    <div className="flex flex-col justify-center items-center h-full mt-20 mx-10 lg:m-0">
      <Title text={dict.page.answerNotFoundPage.title} />
      <Heading text={dict.page.answerNotFoundPage.heading} />
      <Link to="/meet/new">
        <Button text={dict.page.createMeeting.createButton} />
      </Link>
    </div>
  );
}
