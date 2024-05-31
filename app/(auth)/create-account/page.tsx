"use client";
import Input from "@/components/input";
import Button from "@/components/button";
import { useFormState } from "react-dom";
import { createAccount } from "./actions";
import { ArrowLeftCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function CreateAccount() {
  const [state, action] = useFormState(createAccount, null);

  return (
    <div className=" p-12 flex flex-col gap-10 items-center w-full bg relative">
      <div className="absolute top-6 left-6">
        <Link href={`/log-in`}>
          <ArrowLeftCircleIcon className="size-8" />
        </Link>
      </div>
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
          name="username"
          type="text"
          required
          placeholder="Username"
          errors={state?.fieldErrors.username}
        />
        <Input
          name="password"
          type="password"
          placeholder="Password"
          required
          errors={state?.fieldErrors.password}
        />
        <Input
          name="confirmPassword"
          type="password"
          placeholder="Confirm password"
          required
          errors={state?.fieldErrors.password}
        />
        <Input
          name="bio"
          type="text"
          placeholder="Bio"
          required
          errors={state?.fieldErrors.bio}
        />

        <Button btnTitle="Sign Up" />
      </form>
    </div>
  );
}
