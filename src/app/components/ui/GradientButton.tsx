"use client";

import { clsx } from "clsx";
import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type GradientButtonProps = {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
};

export default function GradientButton({
  children,
  className = "",
  onClick,
  disabled = false,
  type = "button",
  ...rest
}: GradientButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={twMerge(
        clsx(
          "group relative inline-flex items-center justify-center overflow-hidden rounded-[20px] font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-95 focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100",
          "bg-dark hover:bg-black text-white hover:shadow-xl hover:shadow-dark/20",
          className,
        ),
      )}
      {...rest}
    >
      <span className="relative flex items-center gap-2 justify-center rounded-[20px] px-6 py-2.5 transition-all duration-300 ease-out text-white">
        {children}
      </span>
    </button>
  );
}
