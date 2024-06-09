"use client";

import { uploadReply } from "@/app/tweets/[id]/actions";
import { useFormState } from "react-dom";

export default function ReplyInput() {
  const [state, action] = useFormState(uploadReply, null);
  return (
    <form action={``} className="p-2 flex justify-between gap-2 mt-3">
      <input
        type="text"
        placeholder="Input your reply..."
        className="g-red-200 w-full px-2 border"
      />
      <button className="p-2 bg-blue-200 rounded-lg  font-bold">Reply</button>
    </form>
  );
}
