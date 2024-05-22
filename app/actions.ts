"use server";

import { z } from "zod";

const formSchema = z.object({
  email: z.string().email().toLowerCase(),
  username: z.string(),
  password: z
    .string({
      required_error: "Password is required",
    })
    .refine((password) => password === "12345", {
      message: "Wrong password",
    }),
});

export async function logInAction(_: any, formData: FormData) {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const data = {
    email: formData.get("email"),
    username: formData.get("username"),
    password: formData.get("password"),
  };
  try {
    const result = formSchema.safeParse(data);
    console.log(result.error?.flatten());
    if (!result.success) {
      return result.error.flatten();
    }
  } catch (e) {}
}
