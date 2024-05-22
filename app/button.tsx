import { useFormStatus } from "react-dom";

export default function Button() {
  const { pending, data, action } = useFormStatus();

  return (
    <div>
      <button
        disabled={pending}
        className="bg-gray-200 rounded-3xl w-full size-12 transition-all hover:bg-gray-300 active:scale-95"
      >
        {pending ? "Loading..." : "Log in"}
      </button>
    </div>
  );
}
