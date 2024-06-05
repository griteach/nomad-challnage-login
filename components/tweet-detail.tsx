import { getLikeStatus, getTweet } from "@/app/tweets/[id]/actions";
import {
  ArrowLeftCircleIcon,
  ChatBubbleLeftEllipsisIcon,
  CheckBadgeIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import LikeButton from "./like-button";
import { unstable_cache as nextCache, revalidateTag } from "next/cache";
import getSession from "@/lib/session";
import db from "@/lib/db";

export default async function TweetDetail({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const id = Number(params.id);

  const tweet = await getTweet({ id });

  const { likeCount, isLiked } = await getLikeStatus(id);

  return (
    <div className=" p-12 flex flex-col gap-10 items-center w-full ">
      <div className="relative bg-blue-300 text-3xl w-full text-center py-3 font-bold rounded-2xl">
        <Link href={`/`}>
          <ArrowLeftCircleIcon className="size-8 absolute top-1/2 left-6 transform -translate-x-1/2 -translate-y-1/2" />
        </Link>
        <span>GRITWEET</span>
      </div>

      <div className="flex flex-col gap-5 w-full">
        <div className=" rounded-2xl p-5 shadow-lg flex flex-col gap-2 border border-gray-300 w-full">
          <div className="flex justify-start items-center gap-3">
            <div className="bg-slate-400 rounded-full size-10"></div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold">
                  {tweet?.user.username}
                </span>
                <span>
                  <CheckBadgeIcon className="size-5 text-blue-400" />
                </span>
              </div>
              <div className="flex gap-2 items-center">
                <span className="font-semibold">@dog_fats</span>
                <span className="text-blue-400 font-semibold text-sm">
                  follow
                </span>
              </div>
            </div>
          </div>
          <div className="w-full">{tweet?.payload}</div>
          <div className="text-gray-500">{tweet?.created_at.toString()}</div>
          <div className="flex gap-4  mt-2 w-full">
            <div className="flex gap-2">
              <LikeButton
                isLiked={isLiked}
                likeCount={likeCount}
                tweetId={id}
              />
            </div>
            <div className="flex">
              <ChatBubbleLeftEllipsisIcon className="size-5" />
            </div>
            <div>
              <ShareIcon className="size-5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
