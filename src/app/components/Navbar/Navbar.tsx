import HamburgerMenu from "@/components/Navbar/HamburgerMenu.tsx";
import { getDictionary } from "@/lib/dictionary.ts";
import { Locale } from "@root/i18n.config.ts";
import Image from "next/image";
import Link from "next/link";
import meetifyNowLogo from "../../assets/imgs/meetifynow-logo.webp";

export default async function Navbar({ lang }: { lang: Locale }) {
  const dict = await getDictionary(lang);

  return (
    <div className="fixed top-6 z-50 w-full flex justify-center pointer-events-none px-4">
      <nav className="pointer-events-auto w-full max-w-[1000px] bg-white/70 backdrop-blur-xl border border-gray/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[24px] p-4 px-6 md:px-8 flex align-center justify-between items-center transition-all duration-300">
        <Link href={`/${lang}`}>
          <Image
            src={meetifyNowLogo}
            height={28}
            width={200}
            alt="Logo"
            title="MeetifyNow"
            className="h-6 md:h-7 w-auto opacity-90 transition-opacity hover:opacity-100"
            style={{ width: "auto" }}
            priority
          />
        </Link>
        <HamburgerMenu dict={dict} />
      </nav>
    </div>
  );
}
