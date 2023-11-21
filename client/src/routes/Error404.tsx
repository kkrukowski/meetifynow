import BigText from "../components/BigText";
import Button from "../components/Button";
import Heading from "../components/Heading";

import { Link } from "react-router-dom";

export default function Error404() {
  return (
    <div className="flex flex-col justify-center items-center h-full">
      <BigText text="404" />
      <Heading text="Nie znaleziono takiej strony 😥" />
      <Link to="/">
        <Button text="Strona główna" />
      </Link>
    </div>
  );
}
