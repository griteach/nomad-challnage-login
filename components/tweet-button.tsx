import { useFormStatus } from "react-dom";

export default function PostButton({ btnTitle }: { btnTitle: string }) {
  const { pending, data, action } = useFormStatus();

  return (
    <div>
      <button
        disabled={pending}
        className=" px-4 py-1 rounded-xl text-white bg-blue-300 hover:scale-105 active:bg-blue-500 transition-all"
      >
        {pending ? (
          <span className="loading loading-infinity loading-xs"></span>
        ) : (
          btnTitle
        )}
      </button>
    </div>
  );
}
