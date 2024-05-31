import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import {
  HeartIcon,
  ChatBubbleLeftEllipsisIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";
import { getAllTweets, getAllTweetsCache } from "./actions";
import Link from "next/link";
import { Prisma } from "@prisma/client";
import TweetsList from "@/components/tweets-list";

export type InitialTweets = Prisma.PromiseReturnType<typeof getAllTweets>;

export default async function Home() {
  const initialTweets = await getAllTweetsCache(1);

  return <TweetsList initialTweets={initialTweets} />;
}
