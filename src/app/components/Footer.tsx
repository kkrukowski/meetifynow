import meetifyNowLogo from "@/assets/imgs/meetifynow-logo.webp";
import webdkwLogo from "@/assets/imgs/webdkw-logo.svg"; // Upewnij się, że logo jest tutaj zapisane
import Image from "next/image";

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
          <a
            href="https://webdkw.net/"
            target="_blank"
            rel="noopener"
            title="Tworzenie stron internetowych WebDKW"
            className="flex items-center gap-2 mt-2 text-sm text-gray-500 hover:opacity-80 transition-opacity"
          >
            Aplikację stworzyła firma
            <Image
              src={webdkwLogo}
              height={24}
              width={100}
              className="h-6 w-auto object-contain"
              alt="Agencja interaktywna, tworzenie stron i sklepów internetowych WebDKW"
            />
          </a>
          <p className="text-center text-gray-400 text-sm mt-3">
            {new Date().getFullYear()} © meetifynow.com
          </p>
        </div>
      </div>
    </footer>
  );
}
