import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Footer() {
  return (
    <div className="flex flex-col justify-center items-center absolute left-0 bottom-0 w-full p-5">
      <p className="text-dark">
        <a href="https://github.com/kkrukowski">
          @kkrukowski
          <span className="ml-2">
            <FontAwesomeIcon icon={faGithub} />
          </span>
        </a>
      </p>
      <p className="text-center text-dark text-sm">2023 © meetifynow.com</p>
    </div>
  );
}
