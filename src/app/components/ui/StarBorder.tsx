"use client";

import { clsx } from "clsx";
import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type StarBorderProps = {
  children: ReactNode;
  className?: string;
  as?: React.ElementType;
  classNameInner?: string;
  color?: string;
  speed?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
};

export default function StarBorder({
  as: Component = "button",
  className = "",
  classNameInner = "",
  color = "white",
  speed = "6s",
  children,
  type = "button",
  disabled = false,
  onClick,
  ...rest
}: StarBorderProps) {
  return (
    <Component
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={twMerge(
        clsx(
          "relative inline-block w-fit overflow-hidden rounded-[20px] p-[1px] disabled:opacity-50 disabled:cursor-not-allowed group",
          className,
        ),
      )}
      {...rest}
    >
      <div className="absolute inset-[1px] bg-gradient-to-r from-transparent via-white to-transparent opacity-0 mix-blend-overlay group-hover:opacity-30 group-hover:animate-starBorder z-10 transition-opacity duration-300" />
      <div
        className={twMerge(
          clsx(
            "relative flex items-center justify-center rounded-[19px] bg-primary group-hover:bg-primary-hover group-active:bg-primary-active text-white px-4 py-2 text-sm font-[Poppins] transition-all duration-300",
            classNameInner,
          ),
        )}
      >
        {children}
      </div>
    </Component>
  );
}
