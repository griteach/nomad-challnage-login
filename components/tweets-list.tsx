"use client";

import { getAllTweets, getAllTweetsCache } from "@/app/actions";
import { InitialTweets } from "@/app/page";
import db from "@/lib/db";
import { cls } from "@/lib/utils";
import {
  ChatBubbleLeftEllipsisIcon,
  CheckBadgeIcon,
  HeartIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";
import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface TweetsProps {
  initialTweets: InitialTweets;
}
export default function TweetsList({ initialTweets }: TweetsProps) {
  const [tweets, setTweets] = useState(initialTweets);
  const [page, setPage] = useState(1);
  const [isFirstPage, setIsFirstPage] = useState(true);
  //   const trigger = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    async function getNewTweets(changedPage: number) {
      const newTweets = await getAllTweets(changedPage);
      if (newTweets.length !== 0) {
        setTweets([...newTweets]);
      }
    }
    getNewTweets(page);
  }, [page]);

  const onLeftClick = () => {
    if (page === 2) {
      setPage((prev) => prev - 1);
      setIsFirstPage(true);
      return;
    } else {
      setPage((prev) => prev - 1);
    }
  };
  const onRightClick = () => {
    setIsFirstPage(false);
    setPage((prev) => prev + 1);
  };
  return (
    <div className=" p-12 flex flex-col gap-10 items-center w-full ">
      <div className="bg-blue-300 text-3xl w-full text-center py-3 font-bold rounded-2xl">
        GRITWEET
      </div>

      <div className="flex flex-col gap-5 w-full">
        {tweets.map((tweet, index) => (
          <Link href={`/tweets/${tweet.id}`} key={index}>
            <div className=" rounded-2xl p-5 shadow-lg flex flex-col gap-2 border border-gray-300 w-full">
              <div className="flex justify-start items-center gap-3">
                <div className="bg-slate-400 rounded-full size-10"></div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">
                      {tweet.user.username}
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
              <div>{tweet.payload}</div>
              <div className="text-gray-500">{tweet.created_at.toString()}</div>
              <div className="flex gap-4  mt-2 w-full">
                <div className="flex gap-2">
                  <HeartIcon className="size-5" />
                  {/* <div>{tweet._count.likes}</div> */}
                </div>
                <div className="flex">
                  <ChatBubbleLeftEllipsisIcon className="size-5" />
                </div>
                <div>
                  <ShareIcon className="size-5" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="flex items-center">
        <button onClick={onLeftClick} disabled={isFirstPage}>
          <ArrowLeftCircleIcon
            className={cls(
              "size-10 text-blue-300",
              isFirstPage ? "cursor-not-allowed text-gray-300" : ""
            )}
          />
        </button>
        <div className="text-lg">{`· · ·  ${page}  · · ·`}</div>
        <button onClick={onRightClick}>
          <ArrowRightCircleIcon className="size-10 text-blue-300" />
        </button>
      </div>
    </div>
  );
}
