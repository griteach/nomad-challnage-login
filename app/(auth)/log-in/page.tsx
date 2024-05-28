"use client";
import Button from "@/components/button";
import Input from "@/components/input";
import { useFormState } from "react-dom";
import { login } from "./actions";

export default function LoginPage() {
  const [state, action] = useFormState(login, null);
  return (
    <div className=" p-12 flex flex-col gap-10 items-center w-full ">
      <div className="text-5xl">🔥</div>
      <form action={action} className="flex flex-col gap-4 w-full">
        <Input
          name="email"
          type="email"
          required
          placeholder="Email"
          errors={state?.fieldErrors.email}
        />

        <Input
          name="password"
          type="password"
          placeholder="Password"
          required
          errors={state?.fieldErrors.password}
        />

        <Button btnTitle="Login" />
      </form>
    </div>
  );
}
