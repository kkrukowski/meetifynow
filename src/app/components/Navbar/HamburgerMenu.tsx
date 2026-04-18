"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type HamburgerMenuProps = {
  dict: any;
};

export default function HamburgerMenu({ dict }: HamburgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="relative flex-col justify-center items-center cursor-pointer p-2 z-50 flex focus:outline-none hover:opacity-80 transition-opacity"
        aria-label="Menu"
      >
        <span
          className={`bg-dark block transition-all duration-300 ease-out h-[3px] w-6 rounded-full ${
            isOpen ? "rotate-45 translate-y-[5px]" : "-translate-y-1"
          }`}
        />
        <span
          className={`bg-dark block transition-all duration-300 ease-out h-[3px] w-6 rounded-full ${
            isOpen ? "opacity-0" : "opacity-100"
          }`}
        />
        <span
          className={`bg-dark block transition-all duration-300 ease-out h-[3px] w-6 rounded-full ${
            isOpen ? "-rotate-45 -translate-y-[7px]" : "translate-y-1"
          }`}
        />
      </button>

      <div
        className={`absolute right-0 top-[60px] w-[240px] bg-white rounded-[24px] p-3 border border-dark/10 shadow-[0_20px_60px_-15px_rgba(0,68,102,0.15)] transition-all duration-300 origin-top-right ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0 visible"
            : "opacity-0 scale-95 -translate-y-2 invisible"
        }`}
      >
        <div className="flex flex-col gap-2">
          <Link
            href="/meet/new"
            onClick={() => setIsOpen(false)}
            className="text-dark/80 hover:text-dark hover:bg-[#f0f6fa] active:bg-[#e4eff7] px-4 py-3.5 rounded-[16px] transition-colors font-medium flex items-center"
          >
            {dict.page?.createMeeting?.title ?? "Nowe spotkanie"}
          </Link>
        </div>
      </div>
    </div>
  );
}
