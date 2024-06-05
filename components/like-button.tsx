"use client";

import { HandThumbUpIcon, HeartIcon } from "@heroicons/react/24/solid";
import { HeartIcon as OutlineHeartIcon } from "@heroicons/react/24/outline";
import { useOptimistic } from "react";
import { dislikePost, likePost } from "@/app/tweets/[id]/actions";

interface LikeButtonProps {
  isLiked: boolean;
  likeCount: number;
  tweetId: number;
}

export default function LikeButton({
  isLiked,
  likeCount,
  tweetId,
}: LikeButtonProps) {
  //첫 번째 인자는 mutation이 발생하기 전에 유저에게 보여주어야 할 데이터
  const [state, reducerFn] = useOptimistic(
    { isLiked, likeCount }, //initial state 초기값

    //return 값 변경될 것으로 예상되는 데이터를 미리 보여주기 위해 만들어준다.
    //실제 데이터는 db나 어디선가 어떻게 됐겠지 뭐.. 라고 생각하는 방식
    //실제 데이터가 완료될때까지 기다리면 너무 오래걸리니까. 그냥 됐겠지 하고 기대되는 결과를
    //먼저 보여주는 것
    //payload는 ReducerFn에서 무언가를 받아와서 이용할때 사용한다.
    (previousState, payload) => ({
      isLiked: !previousState.isLiked,
      likeCount: previousState.isLiked
        ? previousState.likeCount - 1
        : previousState.likeCount + 1,
    })
  );

  const onClick = async () => {
    reducerFn(undefined);
    if (isLiked) {
      await dislikePost(tweetId);
    } else {
      await likePost(tweetId);
    }
  };

  return (
    <button
      onClick={onClick}
      //   className={`flex items-center gap-2 text-neutral-400 text-sm border border-neutral-400 rounded-full p-2  transition-colors ${
      //     isLiked
      //       ? "bg-orange-500 text-white border-orange-500"
      //       : "hover:bg-neutral-800"
      //   }`}
    >
      {state.isLiked ? (
        <HeartIcon className="size-6 text-red-500" />
      ) : (
        <OutlineHeartIcon className="size-6" />
      )}
      {state.likeCount}
    </button>
  );
}
