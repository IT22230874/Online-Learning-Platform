import React from "react";

export default function ChatHeader({ onClose }) {
  return (
    <div className="bg-blue-600 text-white p-3 flex justify-between items-center">
      <h4 className="text-sm font-semibold">AI Assistant</h4>
      <button onClick={onClose} className="text-white hover:text-gray-200">
        &times;
      </button>
    </div>
  );
}
