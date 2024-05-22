"use client";
import Input from "./input";
import Button from "./button";
import { useFormState } from "react-dom";
import { logInAction } from "./actions";
import { CheckBadgeIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

export default function Home() {
  const [state, action] = useFormState(logInAction, null);

  return (
    <div className=" p-12 flex flex-col gap-10 items-center w-full ">
      <div className="text-5xl">🔥</div>
      <form action={action} className="flex flex-col gap-4 w-full">
        <Input name="email" type="email" required placeholder="Email" />
        <Input name="username" type="text" required placeholder="Username" />
        <Input
          name="password"
          type="password"
          placeholder="Password"
          required
          errors={state?.fieldErrors.password}
        />

        <Button />
      </form>
      {state === undefined ? (
        <div className="bg-green-500 w-full rounded-xl size-16 flex justify-start items-center pl-4 gap-3">
          <CheckCircleIcon className="size-6" />
          <span>Welcome back!</span>
        </div>
      ) : null}
    </div>
  );
}
