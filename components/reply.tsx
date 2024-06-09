"use client";

import { InitialReply, uploadReply } from "@/app/tweets/[id]/actions";
import ReplyInput from "./reply-input";
import { useOptimistic, useState } from "react";
import { getCurrentDateTime } from "@/lib/utils";
import { useFormState } from "react-dom";

interface InitialReplyProps {
  initialReply: InitialReply;
  user: {
    id: number;
    created_at: Date;
    updated_at: Date;
    username: string;
    password: string;
    email: string;
    bio: string;
  } | null;
  id: number;
}

export default function Reply({ initialReply, user, id }: InitialReplyProps) {
  const [newReply, setNewReply] = useState("");
  const interceptionFn = (_: any, formData: FormData) => {
    const data = formData.get("reply");
    formData.append("tweetId", id.toString());
    if (data !== null) {
      setNewReply(data as string);
    } else {
      setNewReply("");
    }
    reducerFn(undefined);

    return uploadReply(_, formData);
  };
  const [formState, action] = useFormState(interceptionFn, null);
  const [state, reducerFn] = useOptimistic(
    initialReply, //initial state 초기값

    //return 값 변경될 것으로 예상되는 데이터를 미리 보여주기 위해 만들어준다.
    //실제 데이터는 db나 어디선가 어떻게 됐겠지 뭐.. 라고 생각하는 방식
    //실제 데이터가 완료될때까지 기다리면 너무 오래걸리니까. 그냥 됐겠지 하고 기대되는 결과를
    //먼저 보여주는 것
    //payload는 ReducerFn에서 무언가를 받아와서 이용할때 사용한다.
    (previousState, payload) => [
      ...previousState,

      {
        user: {
          username: user?.username!,
        },

        id: 1,
        created_at: getCurrentDateTime(),
        updated_at: getCurrentDateTime(),
        payload: newReply,
        userId: 1,
        tweetId: 1,
      },
    ]
  );

  const onClick = async () => {};
  return (
    <div
      className="border shadow-md
rounded-2xl p-5"
    >
      <div>
        {initialReply.map((reply, index) => (
          <div
            key={index}
            className="flex gap-2 items-center p-2 last:border-b-2 last:pb-4"
          >
            <div className="bg-slate-400 rounded-full size-8"></div>
            <div className="font-bold">{reply.user.username}</div>
            <div className="w-2/3">{reply.payload}</div>
          </div>
        ))}
      </div>
      <form action={action} className="p-2 flex justify-between gap-2 mt-3">
        <input
          type="text"
          placeholder="Input your reply..."
          name="reply"
          className="g-red-200 w-full px-2 border"
        />
        <button className="p-2 bg-blue-200 rounded-lg  font-bold">Reply</button>
      </form>
    </div>
  );
}
