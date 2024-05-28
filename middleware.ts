import { NextRequest, NextResponse } from "next/server";
import getSession from "./lib/session";

interface Routes {
  [key: string]: boolean;
}
const publicOnlyUrls: Routes = {
  "/": true,
  "/log-in": true,
  "/create-account": true,
  //여기를 publicOnlyUrl에 등록해서, 깃헙으로 로그인하려는 사용자가 미들웨어에 의해 블락되지 않도록 해주자
};

export async function middleware(request: NextRequest) {
  const session = await getSession();
  const exists = publicOnlyUrls[request.nextUrl.pathname];
  if (!session.id) {
    if (!exists) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } else {
    if (exists) {
      //만약 로그인 된 상태에서
      //public only url로 이동하려고 한다면
      //보내줄 이유가 없지. 로그인 되어 있는데 다시 로그인을 하거나, 계정을 만들면 안되니까
      //그래서 다른 페이지로 보내주는거야.
      return NextResponse.redirect(new URL("/profile", request.url));
    }
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
