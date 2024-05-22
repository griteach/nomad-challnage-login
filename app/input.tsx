import { InputHTMLAttributes } from "react";
import {
  BeakerIcon,
  EnvelopeIcon,
  UserIcon,
  WrenchIcon,
} from "@heroicons/react/24/solid";

interface InputProps {
  name: string;
  errors?: string[];
}

export default function Input({
  name,
  type,
  errors = [],
  ...rest
}: InputProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <div className="relative ">
        <div className="absolute top-1/2 left-3 transform -translate-y-1/2 *:size-5 text-gray-500">
          {type === "email" ? (
            <EnvelopeIcon />
          ) : type === "text" ? (
            <UserIcon />
          ) : (
            <WrenchIcon />
          )}
        </div>
        <input
          name={name}
          type={type}
          {...rest}
          className="w-full pl-10 rounded-3xl size-12 transition focus:ring border border-[#E6E5E3] ring-offset-2  focus:ring-[#DCB4BF] focus:outline-none"
        ></input>
      </div>
      {errors.map((error, index) => (
        <div key={index} className="text-red-500 font-medium mt-4">
          {error}
        </div>
      ))}
    </div>
  );
}
