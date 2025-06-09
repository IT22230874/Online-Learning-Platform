import React, { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import ChatWindow from "./ChatWindow";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="mb-3">
          <ChatWindow onClose={() => setIsOpen(false)} />
        </div>
      )}

      <button
        className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-xl transition duration-300 flex items-center justify-center"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Toggle Chat"
      >
        {isOpen ? <X size={20} /> : <MessageCircle size={20} />}
      </button>
    </div>
  );
}
