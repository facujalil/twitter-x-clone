import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface Props {
  register?: UseFormRegisterReturn<string>;
  name: string;
  type?: string;
  datatype?: string;
  value: string;
  maxLength: number;
  autoComplete: string;
  placeholder: string;
  error?: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

function Input({
  register,
  name,
  type,
  datatype,
  value,
  maxLength,
  autoComplete,
  placeholder,
  error,
  onChange,
}: Props) {
  return (
    <input
      {...register}
      name={name}
      type={type}
      datatype={datatype}
      value={value}
      maxLength={maxLength}
      autoComplete={autoComplete}
      placeholder={placeholder}
      onChange={(e) => onChange(e)}
      className={`w-full p-4 bg-transparent border focus:outline-0 ${
        error ? "border-[#ff0000]" : "border-[#2f3336] focus:border-[#1d9bf0]"
      }`}
    />
  );
}

export default Input;
