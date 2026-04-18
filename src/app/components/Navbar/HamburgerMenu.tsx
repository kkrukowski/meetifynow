"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type HamburgerMenuProps = {
  dict: any;
};

export default function HamburgerMenu({ dict }: HamburgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <div className="md:relative">
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="relative flex-col justify-center items-center cursor-pointer p-2 z-50"
      >
        <span
          className={`bg-dark block transition-all duration-300 ease-out h-1 w-8 rounded-sm ${
            isOpen ? "rotate-45 translate-y-2" : "-translate-y-0.5"
          }`}
        />
        <span
          className={`bg-dark block transition-all duration-300 ease-out h-1 w-8 rounded-sm my-0.5 ${
            isOpen ? "opacity-0" : "opacity-100"
          }`}
        />
        <span
          className={`bg-dark block transition-all duration-300 ease-out h-1 w-8 rounded-sm ${
            isOpen ? "-rotate-45 -translate-y-1" : "translate-y-0.5"
          }`}
        />
      </button>

      <div
        className={`absolute z-40 flex flex-col items-center top-0 left-0 w-screen md:w-[400px] h-screen bg-light md:border-l-[1px] md:border-light-active duration-300 ease-out transition-all ${
          isOpen
            ? "opacity-100 md:translate-x-[-330px]"
            : "md:opacity-0 translate-x-[600px] sm:translate-x-[800px] md:translate-x-0"
        }`}
      >
        <div className="mt-[100px] flex flex-col items-center">
          <div className="w-[300px] rounded-lg h-[1px] bg-light-active mb-5" />
          <div className="flex flex-col items-center">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="text-primary text-xl hover:text-primary-hover active:text-primary-active font-medium p-3"
            >
              {dict.page.home?.title ?? "Strona główna"}
            </Link>
            <Link
              href="/meet/new"
              onClick={() => setIsOpen(false)}
              className="text-primary text-xl hover:text-primary-hover active:text-primary-active font-medium p-3"
            >
              {dict.page.createMeeting?.title ?? "Nowe spotkanie"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
