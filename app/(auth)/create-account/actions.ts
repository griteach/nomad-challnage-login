"use server";

import db from "@/lib/db";
import bcrypt from "bcrypt";
import { z } from "zod";

import { redirect } from "next/navigation";
import loginSession from "@/lib/login";

function checkUsername(username: string) {
  return !username.includes("babo");
}
function checkPassword({
  password,
  confirmPassword,
}: {
  password: string;
  confirmPassword: string;
}) {
  return password === confirmPassword;
}

const checkUniqueUsername = async (username: string) => {
  const user = await db.user.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
    },
  });
  console.log("Check username : ", !Boolean(user));
  return !Boolean(user);
};

const checkUniqueUserEmail = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });
  console.log("Check Email : ", !Boolean(user));
  return !Boolean(user);
};

//아래와 같이 필요한 스키마를 한 번에 생성할 수 있다.
const formSchema = z
  .object({
    username: z
      .string({
        invalid_type_error: "사용자의 이름은 숫자로 구성할 수 없습니다.",
        required_error: "Where is my username?",
      })
      .toLowerCase()
      .trim()
      .refine(checkUsername, "바보는 안됩니다. error"),
    email: z.string().email().toLowerCase(),
    password: z.string().min(10),
    confirmPassword: z.string().min(10),
    bio: z.string(),
  })
  //refine을 오브젝트 전체에 넣을 수 있다. 여러 개의 항목을 동시에 체크하기 위해
  .superRefine(async ({ username }, ctx) => {
    const user = await checkUniqueUsername(username);
    if (!user) {
      ctx.addIssue({
        code: "custom",
        message: "이미 사용중인 이름입니다.",
        path: ["username"],
        fatal: true,
      });
      return z.NEVER;
    }
  })
  .superRefine(async ({ email }, ctx) => {
    const user = await checkUniqueUserEmail(email);
    if (!user) {
      ctx.addIssue({
        code: "custom",
        message: "이미 사용중인 email입니다.",
        path: ["email"],
        fatal: true,
      });
      return z.NEVER;
    }
  })
  .refine(checkPassword, {
    message: "패스워드가 일치하지 않습니다.",
    path: ["confirmPassword"],
  });
export async function createAccount(_: any, formData: FormData) {
  //formData에 담겨 있는 것을 data 오브젝트에 모두 넣어주고 있다.
  //여기 있는 username, email, password, confirmPassword 등은 Input의 name을 참조하고 있다.
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    bio: formData.get("bio"),
  };

  const result = await formSchema.safeParseAsync(data);

  console.log("safeParsed result form data : ", result);
  if (!result.success) {
    return result.error.flatten();
    //실패하면 에러를 리턴
  } else {
    //성공하면 무언가를 해야겠지
    //check if username is taken
    //check if the email is already used
    //hash passowrd
    const hashedPassword = await bcrypt.hash(result.data.password, 12);

    const user = await db.user.create({
      data: {
        username: result.data.username,
        email: result.data.email,
        password: hashedPassword,
        bio: result.data.bio,
      },
      select: {
        id: true,
      },
    });
    await loginSession(user.id);
    redirect("/profile");

    //save the user to db (with prisma)
    //log the user in
    //redirect "/home"
  }
}
