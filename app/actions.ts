"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { tweetFormSchema } from "@/lib/tweet-schema";
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

export async function uploadTweet(_: any, formData: FormData) {
  const session = await getSession();
  const data = {
    message: formData.get("message"),
  };
  const result = await tweetFormSchema.safeParse(data);
  console.log("safeParsed result form data : ", result);

  if (!result.success) {
    return result.error.flatten();
    //실패하면 에러를 리턴
  } else {
    //성공하면 무언가를 해야겠지
    //check if username is taken
    //check if the email is already used
    //hash passowrd

    const user = await db.tweet.create({
      data: {
        payload: result.data.message,
        user: {
          connect: {
            id: session.id,
          },
        },
      },
    });
    revalidateTag("tweets-all");
  }
}
