import HamburgerMenu from "@/components/Navbar/HamburgerMenu.tsx";
import { getDictionary } from "@/lib/dictionary.ts";
import { Locale } from "@root/i18n.config.ts";
import Image from "next/image";
import Link from "next/link";
import meetifyNowLogo from "../../assets/imgs/meetifynow-logo.webp";

export default async function Navbar({ lang }: { lang: Locale }) {
  const dict = await getDictionary(lang);

  return (
    <nav className="fixed z-50 top-0 w-full max-w-[1250px] bg-light border-b-[1px] border-light-active p-5 md:p-6 flex align-center justify-between items-center">
      <Link href={`/${lang}`}>
        <Image
          src={meetifyNowLogo}
          height={28}
          width={200}
          alt="Logo"
          title="MeetifyNow"
          className="h-7 w-auto"
          priority
        />
      </Link>
      <HamburgerMenu dict={dict} />
    </nav>
  );
}
