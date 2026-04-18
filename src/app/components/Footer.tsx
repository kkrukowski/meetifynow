import meetifyNowLogo from "@/assets/imgs/meetifynow-logo.webp";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-[#f8fafc] border-t border-gray-200/50 py-12 px-5">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
        <div className="flex flex-col items-center md:items-start gap-4">
          <Image
            src={meetifyNowLogo}
            height={28}
            width={200}
            alt="MeetifyNow"
            className="h-7 w-auto opacity-80"
          />
          <p className="text-gray-500 text-sm max-w-xs text-center md:text-left">
            Proste i szybkie zaplanowanie wspólnych spotkań bez rejestracji i
            niepotrzebnych kroków.
          </p>
        </div>

        <div className="flex flex-col items-center md:items-end gap-2">
          <Link
            href="https://github.com/kkrukowski"
            target="_blank"
            className="flex items-center text-gray-500 hover:text-primary transition-colors hover:-translate-y-0.5 duration-200"
          >
            <span className="font-medium mr-2">@kkrukowski</span>
            <span className="h-5 w-5">
              <FontAwesomeIcon icon={faGithub} />
            </span>
          </Link>
          <p className="text-center text-gray-400 text-sm">
            {new Date().getFullYear()} © meetifynow.com
          </p>
        </div>
      </div>
    </footer>
  );
}
