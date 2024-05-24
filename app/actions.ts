"use server";

import { z } from "zod";

const formSchema = z.object({
  email: z
    .string()
    .email()
    .toLowerCase()
    .refine((email) => email.endsWith("@zod.com"), {
      message: "Email must end with @zod.com",
    }),
  username: z
    .string()
    .min(5, { message: "Username must be at least 5 characters long" }),
  password: z
    .string()
    .min(10, { message: "Password must be at least 10 characters long" })
    .refine(
      (password) => {
        for (const char of password) {
          if (!isNaN(parseInt(char))) {
            return true;
          }
        }
        return false;
      },
      {
        message: "Password must contain at least one number",
      }
    ),
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
