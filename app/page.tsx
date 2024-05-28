import Link from "next/link";

export default function Home() {
  return (
    <div className=" p-12 flex flex-col gap-10 items-center w-full ">
      <div className="text-9xl">🔥</div>
      <div className="flex gap-6">
        <Link
          href={`/create-account`}
          className="rounded-lg p-3 bg-orange-400 shadow-md"
        >
          Sign Up
        </Link>
        <Link
          href={`/log-in`}
          className="rounded-lg p-3 bg-green-400 shadow-md"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}
