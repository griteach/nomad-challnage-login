"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { unstable_cache as nextCache, revalidateTag } from "next/cache";

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

      _count: true,
    },
  });
  return tweet;
}

export async function dislikePost(tweetId: number) {
  try {
    const session = await getSession();
    await db.like.delete({
      where: {
        id: {
          tweetId,
          userId: session.id!,
        },
      },
    });
    revalidateTag(`like-status-${tweetId}`);
  } catch (e) {}
}

export async function likePost(tweetId: number) {
  try {
    const session = await getSession();
    await db.like.create({
      data: {
        tweetId,
        userId: session.id!,
      },
    });
    revalidateTag(`like-status-${tweetId}`);
  } catch (e) {}
}

export async function getLikeStatus(tweetId: number) {
  const session = await getSession();
  const isLiked = await db.like.findUnique({
    where: {
      id: {
        tweetId,
        userId: session.id!,
      },
    },
  });
  const likeCount = await db.like.count({
    where: {
      tweetId,
    },
  });
  return {
    likeCount,
    isLiked: Boolean(isLiked),
  };
}

// export async function getCachedLikeStatus(tweetId: number) {
//   const cachedOperation = nextCache(getLikeStatus, ["product-like-status"], {
//     tags: [`like-status-${tweetId}`],
//   });
//   return cachedOperation(tweetId);
// }
