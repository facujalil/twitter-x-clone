import {
  ChangeEventHandler,
  HTMLInputAutoCompleteAttribute,
  HTMLInputTypeAttribute,
} from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface Props {
  register?: UseFormRegisterReturn<string>;
  name?: string;
  type?: HTMLInputTypeAttribute;
  datatype?: string;
  value?: string;
  maxLength?: number;
  autoFocus?: boolean;
  autoComplete?: HTMLInputAutoCompleteAttribute;
  placeholder?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  error?: boolean;
}

function Input({
  register,
  name,
  type,
  datatype,
  value,
  maxLength,
  autoFocus,
  autoComplete,
  placeholder,
  onChange,
  error,
}: Props) {
  return (
    <input
      {...register}
      name={name}
      type={type}
      datatype={datatype}
      value={value}
      maxLength={maxLength}
      autoFocus={autoFocus}
      autoComplete={autoComplete}
      placeholder={placeholder}
      onChange={onChange}
      className={`w-full p-4 bg-transparent border focus:outline-0 ${
        error ? "border-[#ff0000]" : "border-[#2f3336] focus:border-[#1d9bf0]"
      }`}
    />
  );
}

export default Input;
