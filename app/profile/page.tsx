import { HomeIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function Profile() {
  return (
    <div className="flex flex-col justify-center items-center">
      <div>
        <Link href={`/`}>
          <HomeIcon className="size-10 text-orange-400" />
        </Link>
      </div>
      <div>Welcome Back!!!</div>
    </div>
  );
}
