import React, { useEffect, useRef } from "react";

export default function ChatMessages({ messages }) {
  const ref = useRef(null);

  useEffect(() => {
    ref.current?.scrollTo(0, ref.current.scrollHeight);
  }, [messages]);

  return (
    <div ref={ref} className="flex-1 overflow-y-auto p-3 space-y-2 text-sm">
      {messages.map((msg, i) => (
        <div
          key={i}
          className={`p-2 rounded-lg max-w-xs ${
            msg.role === "user" ? "bg-blue-100 self-end ml-auto" : "bg-gray-100"
          }`}
        >
          {msg.content}
        </div>
      ))}
    </div>
  );
}
