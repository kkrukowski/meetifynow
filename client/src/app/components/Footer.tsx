import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Footer() {
  return (
    <footer className="flex flex-none flex-col justify-center items-center relative left-0 bottom-0 w-full p-2">
      <div className="flex flex-col justify-center items-center w-fit">
        <div className="w-full h-px bg-dark mb-2"></div>
        <p className="text-dark">
          <a href="https://github.com/kkrukowski" className="flex items-center">
            <span>@kkrukowski</span>

            <span className="ml-2 h-5 w-5">
              <FontAwesomeIcon icon={faGithub} />
            </span>
          </a>
        </p>
        <p className="text-center text-dark text-sm">2023 © meetifynow.com</p>
      </div>
    </footer>
  );
}
