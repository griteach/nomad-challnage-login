"use client";
import { useRef } from "react";
import Textarea from "./tweet-textarea";

export default function AddTweet() {
  return (
    <div className="flex w-full rounded-2xl shadow-lg border border-gray-300 h-44 p-5">
      <div className="flex justify-start gap-2 w-full">
        <div className="rounded-full size-10 bg-slate-400"></div>
        <div className="grow">
          <Textarea name="message" />
        </div>
      </div>
    </div>
  );
}
