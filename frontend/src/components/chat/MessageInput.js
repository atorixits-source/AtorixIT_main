"use client";

import { useState, useRef } from "react";
import { useChat } from "@/context/ChatContext";

export default function MessageInput({ onSend }) {

  const [text, setText] = useState("");
  const typingTimeout = useRef(null);

  const { sendRaw, activeUser } = useChat();

  const submit = (e) => {
    e.preventDefault();

    if (!text.trim()) return;

    onSend(text);
    setText("");

    sendRaw({
      type: "TYPING_STOP",
      receiverId: activeUser?._id,
    });
  };

  const handleTyping = (value) => {

    setText(value);

    if (!activeUser?._id) return;

    sendRaw({
      type: "TYPING_START",
      receiverId: activeUser._id,
    });

    clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      sendRaw({
        type: "TYPING_STOP",
        receiverId: activeUser._id,
      });
    }, 1200);
  };

  return (
    <form
      onSubmit={submit}
      className="p-3 border-t dark:border-gray-700 flex"
    >
      <input
        value={text}
        onChange={(e) => handleTyping(e.target.value)}
        className="
          flex-1
          px-3 py-2
          rounded
          border
          dark:bg-gray-700
          dark:text-white
          dark:placeholder-gray-400
        "
        placeholder="Type message..."
      />

      <button
        type="submit"
        className="ml-2 px-4 bg-blue-500 text-white rounded"
      >
        Send
      </button>
    </form>
  );
}
