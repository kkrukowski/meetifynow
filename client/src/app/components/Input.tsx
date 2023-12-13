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
  value?: string;
  required?: boolean | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const Input = ({
  label,
  type,
  id,
  register,
  placeholder,
  options,
  error,
  errorText,
  onChange,
  value,
  required = false,
}: Props) => {
  return (
    <div className="flex flex-col w-[300px] gap-2">
      <div className="flex justify-between">
        <label htmlFor={id} className="font-medium text-gray">
          {label}
          {required && <span className="text-red">*</span>}
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
        value={value}
        autoComplete="off"
        required={required}
      />
      <p className="text-sm relative -top-1 text-red font-medium">
        {errorText}
      </p>
    </div>
  );
};

export default Input;
