import { Locale } from "@root/i18n.config";
import Image from "next/image";
import Link from "next/link";
import meetifyNowLogo from "../assets/imgs/meetifynow-logo.webp";
import { LoginButton } from "@/components/Auth/LoginButton";
import {getDictionary} from "@/lib/dictionary.ts";

export default async function Navbar({ lang }: { lang: Locale }) {
    const dict = await getDictionary(lang);

  return (
    <nav className="fixed top-0 w-full max-w-[1250px] p-5 md:p-8 flex align-center justify-between">
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
        <LoginButton text={dict.page.login.button.login} mode="redirect" />
    </nav>
  );
}
