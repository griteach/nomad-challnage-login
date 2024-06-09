"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { Prisma } from "@prisma/client";
import {
  unstable_cache as nextCache,
  revalidatePath,
  revalidateTag,
} from "next/cache";
import { z } from "zod";

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

export async function getReply(tweetId: number) {
  const reply = await db.response.findMany({
    where: {
      tweetId,
    },
    include: {
      user: {
        select: {
          username: true,
        },
      },
    },
  });
  return reply;
}

export type InitialReply = Prisma.PromiseReturnType<typeof getReply>;

const formSchema = z.object({
  reply: z.string().min(1).max(70, {
    message: "Too long",
  }),
  tweetId: z.string(),

  // .min(PASSWORD_MIN_LENGTH),
  // .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
});

export async function uploadReply(_: any, formData: FormData) {
  const session = await getSession();
  const data = {
    reply: formData.get("reply"),
    tweetId: formData.get("tweetId"),
  };

  const result = formSchema.safeParse(data);
  if (result.success) {
    const reply = await db.response.create({
      data: {
        payload: result.data.reply,
        user: {
          connect: {
            id: session.id,
          },
        },
        tweet: {
          connect: {
            id: Number(result.data.tweetId),
          },
        },
      },
    });

    revalidatePath(`/tweets/${result.data.tweetId}`);
  }
}

// export async function getCachedLikeStatus(tweetId: number) {
//   const cachedOperation = nextCache(getLikeStatus, ["product-like-status"], {
//     tags: [`like-status-${tweetId}`],
//   });
//   return cachedOperation(tweetId);
// }
