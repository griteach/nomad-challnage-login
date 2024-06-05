"use client";
export default function Reply() {
  return (
    <div
      className="border shadow-md
rounded-2xl p-5"
    >
      <div>
        {[1, 2, 3, 4, 5].map((reply, index) => (
          <div
            key={index}
            className="flex gap-2 items-center p-2 last:border-b-2"
          >
            <div className="bg-slate-400 rounded-full size-5"></div>
            <div>username</div>
            <div>{`${reply}번째 댓글입니다. ${reply}번째 댓글입니다. ${reply}번째 댓글입니다. ${reply}번째 댓글입니다. ${reply}번째 댓글입니다. ${reply}번째 댓글입니다. `}</div>
          </div>
        ))}
      </div>

      <form action={``} className="p-2 flex justify-between gap-2 mt-3">
        <input
          type="text"
          placeholder="Input your reply..."
          className="g-red-200 w-full px-2 border"
        />
        <button className="p-2 bg-blue-200 rounded-lg  font-bold">Reply</button>
      </form>
    </div>
  );
}
