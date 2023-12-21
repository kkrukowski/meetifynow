import { Locale } from "@root/i18n.config";
import Image from "next/image";
import Link from "next/link";
import meetifyNowLogo from "../assets/imgs/meetifynow-logo.webp";
export default function Navbar({ lang }: { lang: Locale }) {
  return (
    <nav className="absolute left-0 top-0 w-full p-5 md:p-8 flex align-center">
      <Link href={`/${lang}`}>
        <Image
          src={meetifyNowLogo}
          height={32}
          width={200}
          alt="Logo"
          title="MeetifyNow"
          className="h-8 w-auto"
          priority
        />
      </Link>
    </nav>
  );
}
