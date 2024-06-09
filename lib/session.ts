import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import db from "./db";

interface SessionContent {
  id?: number;
}

export default function getSession() {
  return getIronSession<SessionContent>(cookies(), {
    cookieName: "nomad-challange-carrot",
    password: process.env.COOKIE_PASSWORD!,
  });
}

//해당 물품목록이 현재 접속한 사용자의 것이라면 구매할 수 없겠지
//또는 에디트 버튼이 나와야겠지
//따라서 현재 물품 등록자와 현재 접속한 사람이 같은 사람인지 구분해야한다.
export async function getIsOwner(userId: number) {
  // 세션을 불러와서 아이디를 꺼낼거야.
  const session = await getSession();
  if (session.id) {
    return session.id === userId; //세션 아이디와 물건의 유저 아이디가 같다면 true
  } else {
    return false; //아니면 당연히 false
  }
}

export async function getUserInfo(userId: number) {
  const session = await getSession();
  const user = await db.user.findUnique({
    where: {
      id: session.id,
    },
  });
  if (user) {
    return user;
  }
}
