"use client";
import { InputHTMLAttributes, useEffect, useRef, useState } from "react";
import Button from "./button";
import PostButton from "./tweet-button";
import { uploadTweet } from "@/app/actions";
import { useFormState } from "react-dom";

interface InputProps {
  name: string;
  errors?: string[];
}

export default function Textarea({
  name,
  errors = [],
  ...rest
}: InputProps & InputHTMLAttributes<HTMLTextAreaElement>) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [message, setMessage] = useState("");
  const [charCount, setCharCount] = useState(0);

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputMessage = e.target.value;
    if (inputMessage.length <= 140) {
      setMessage(inputMessage);
      setCharCount(inputMessage.length);
    }
  };
  const [state, action] = useFormState(uploadTweet, null);

  const reset = () => {
    setMessage("");
    setCharCount(0);
  };
  return (
    <form action={action} onSubmit={reset} className="h-full">
      <textarea
        ref={textareaRef}
        onInput={handleInput}
        onChange={handleChange}
        rows={1}
        name="message"
        value={message}
        placeholder="What is happening?!"
        className="w-full h-2/3 resize-none outline-none text-lg "
        {...rest}
      />
      <div className="flex justify-end gap-4 items-center w-full mt-2">
        <span className="text-red-500">{state?.fieldErrors.message}</span>
        <span>{charCount}/140</span>
        <PostButton btnTitle="Post" />
      </div>
    </form>
  );
}
