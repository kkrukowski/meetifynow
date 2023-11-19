import BigText from "../components/BigText";
import Button from "../components/Button";
import Heading from "../components/Heading";

import { useRouteError } from "react-router-dom";

export default function Error404() {
  const error = useRouteError();
  return (
    <div className="flex flex-col justify-center items-center h-full">
      <BigText text="404" />
      <Heading text="Nie znaleziono takiej strony 😥" />
      <a href="/">
        <Button text="Strona główna" />
      </a>
    </div>
  );
}
