import React, { useState } from "react";
import axios from "axios";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

const API_URL = import.meta.env.VITE_API_URL;

export default function ChatWindow({ onClose }) {
  const [messages, setMessages] = useState([]);

  const handleSend = async (userMessage) => {
    const newMessages = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);

    try {
      const res = await axios.post(`${API_URL}/api/chat`, {
        message: userMessage,
      });

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.data.response },
      ]);
    } catch (err) {
      console.error("Error calling chat API:", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error: Unable to get response." },
      ]);
    }
  };

  return (
    <div className="w-80 h-96 bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden">
      <ChatHeader onClose={onClose} />
      <ChatMessages messages={messages} />
      <ChatInput onSend={handleSend} />
    </div>
  );
}
