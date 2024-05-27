"use server";

import db from "@/lib/db";
import bcrypt from "bcrypt";
import { z } from "zod";

import { redirect } from "next/navigation";

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

// const checkUniqueUsername = async (username: string) => {
//   const user = await db.user.findUnique({
//     where: {
//       username,
//     },
//     //데이터를 요청할 때 항상 필요한것만 요청하자.
//     //다시 말해 굳이 많은 양의 데이터를 요청하지 말자는 뜻.
//     //여기서는 유저가 있는지 확인만 하기때문에 user의 모든 데이터를 가져올필요가 없다.
//     //따라서 select를 활용해서 id만 가져오고, 이 username이 있는지 없는지만 체크하자.
//     select: {
//       id: true,
//     },
//   });
//   return !Boolean(user);
// };

// const checkUniqueUserEmail = async (email: string) => {
//   //데이터를 요청할 때 항상 필요한것만 요청하자.
//   //다시 말해 굳이 많은 양의 데이터를 요청하지 말자는 뜻.
//   //여기서는 유저가 있는지 확인만 하기때문에 user의 모든 데이터를 가져올필요가 없다.
//   //따라서 select를 활용해서 id만 가져오고, 이 username이 있는지 없는지만 체크하자.
//   const user = await db.user.findUnique({
//     where: {
//       email,
//     },
//     select: {
//       id: true,
//     },
//   });
//   return !Boolean(user);
// };
//유효성 검사 하고 싶은 내용을 일단 설명해 놓자. 설계도 같은거지
//청사진 같은거

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
    // .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
    confirmPassword: z.string().min(10),
    bio: z.string(),
  }) //refine을 오브젝트 전체에 넣을 수 있다. 여러 개의 항목을 동시에 체크하기 위해
  .superRefine(async ({ username }, ctx) => {
    const user = await db.user.findUnique({
      where: {
        username,
      },
      select: {
        id: true,
      },
    });
    if (user) {
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
    const user = await db.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
      },
    });
    if (user) {
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
    redirect("/profile");
    //save the user to db (with prisma)
    //log the user in
    //redirect "/home"
  }
}
