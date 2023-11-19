import Button from "../components/Button";
import Heading from "../components/Heading";
import Title from "../components/Title";

export default function AnswetNotFound() {
  return (
    <div className="flex flex-col justify-center items-center h-full mt-20 mx-10 lg:m-0">
      <Title text="Nie znaleziono takiego spotkania 😥" />
      <Heading text="Zawsze możesz stworzyć własne 😎" />
      <a href="/meet/new">
        <Button text="Utwórz spotkanie" />
      </a>
    </div>
  );
}
