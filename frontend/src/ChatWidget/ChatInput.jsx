import React, { useState } from "react";

export default function ChatInput({ onSend }) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="p-2 border-t flex items-center gap-2">
      <input
        type="text"
        className="flex-1 border rounded px-2 py-1 text-sm"
        placeholder="Type a message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <button
        onClick={handleSend}
        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
      >
        Send
      </button>
    </div>
  );
}
