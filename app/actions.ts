"use server";

import db from "@/lib/db";
import { unstable_cache as nextCache, revalidateTag } from "next/cache";

export async function getAllTweets(page: number, pageSize: number = 3) {
  const skip = (page - 1) * pageSize;
  const tweets = await db.tweet.findMany({
    skip,
    take: pageSize,
    include: {
      user: {
        select: {
          username: true,
        },
      },
      _count: {
        select: {
          likes: true,
        },
      },
    },
    // skip: 10,
    orderBy: {
      created_at: "desc",
    },
  });

  return tweets;
}

export const getAllTweetsCache = nextCache(getAllTweets, ["tweets-all"], {
  tags: ["tweets-all"],
});
