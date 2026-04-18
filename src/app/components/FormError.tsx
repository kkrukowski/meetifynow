import React from "react";
import { FaTriangleExclamation, FaCircleCheck } from "react-icons/fa6";

type Props = {
  text: string,
  error?: boolean
};

export const FormError = ({
  text,
  error = false
}: Props) => {
  return (
      <div className={
          `flex flex-row items-center w-full p-3 font-medium border rounded-lg` +
          (error ? " border-red text-red bg-light-red" : " border-green text-green bg-light-green")
      }>
          { error ? <FaTriangleExclamation className="mr-2" /> : <FaCircleCheck className="mr-2" />}
        <span>{text}</span>
      </div>
  );
};
