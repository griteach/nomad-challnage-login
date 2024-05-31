"use server";

import db from "@/lib/db";

interface TweetProps {
  id: number;
}

export async function getTweet({ id }: TweetProps) {
  const tweet = await db.tweet.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          username: true,
          bio: true,
        },
      },
    },
  });
  return tweet;
}
