import React from "react";

type Props = {
  label: string;
  type: string;
  id: string;
  register: any;
  placeholder: string;
  options?: any;
  errorText?: string | undefined | null;
  error?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const Input = ({
  label,
  type,
  id,
  register,
  placeholder,
  options,
  error,
  errorText,
  onChange,
}: Props) => {
  return (
    <div className="flex flex-col w-[300px] gap-2">
      <div className="flex justify-between">
        <label htmlFor={id} className="font-medium text-gray">
          {label}
        </label>
      </div>
      <input
        id={id}
        {...register(id, { ...options })}
        type={type}
        className={
          `w-full p-3 text-dark font-medium border border-gray focus:outline-none focus:ring focus:border-primary rounded-lg placeholder:opacity-60 transition-all` +
          (error ? " border-red focus:ring-red/50 focus:border-red" : "")
        }
        placeholder={placeholder}
        onChange={onChange}
      />
      <p className="text-sm relative -top-1 text-red font-medium">
        {errorText}
      </p>
    </div>
  );
};
