import React from "react";
import { FaTriangleExclamation } from "react-icons/fa6";

type Props = {
  text: string,
};

export const WarningToast = ({
  text
}: Props) => {
  return (
      <div className={
          `flex flex-row items-center w-full p-3 font-medium border rounded-lg border-yellow-600 text-yellow-600 bg-yellow-100`
      }>
          <FaTriangleExclamation className="mr-2" />
        <span>{text}</span>
      </div>
  );
};
