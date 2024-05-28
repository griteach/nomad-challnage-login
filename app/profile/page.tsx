import db from "@/lib/db";
import getSession from "@/lib/session";
import { ArrowLeftCircleIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default async function Profile() {
  const session = await getSession();
  const user = await db.user.findUnique({
    where: {
      id: session.id,
    },
    select: {
      username: true,
      email: true,
      bio: true,
    },
  });
  return (
    <div className="flex flex-col w-full h-screen justify-center items-center ">
      <div className="mb-10 pl-6 w-full">
        <Link href={`/`}>
          <ArrowLeftCircleIcon className="size-10 text-orange-400" />
        </Link>
      </div>
      <h1 className="text-5xl">Welcome Back!</h1>
      <div className="flex flex-col gap-6 *:text-2xl mt-6 shadow-2xl p-4 rounded-xl bg-orange-200">
        <div>{`${user?.username}님, 안녕하세요.`}</div>
        <div>{`email : ${user?.email}`}</div>
        <div>{`bio : ${user?.bio}`}</div>
      </div>
    </div>
  );
}
