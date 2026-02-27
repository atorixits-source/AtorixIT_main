"use client";

import { useChat } from "@/context/ChatContext";
import { getCurrentUser } from "@/lib/auth";

export default function MessageBubble({ message }) {

  const { deliveryStatus } = useChat();
  const me = getCurrentUser();

  const isMine = message.sender === me?._id;

  const status = deliveryStatus[message._id];

  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
      <div
        className={`
          max-w-[65%]
          px-4 py-2
          rounded-2xl
          text-sm
          break-words
          shadow-sm
          relative
          ${isMine
            ? "bg-blue-600 text-white"
            : "bg-gray-200 dark:bg-gray-700 dark:text-white"}
        `}
      >
        {message.text}

        {isMine && (
          <span className="ml-2 text-xs opacity-80">
            {status === "read" ? (
              <span className="text-blue-300 animate-fadeIn">✓✓</span>
            ) : status === "delivered" ? (
              "✓✓"
            ) : (
              "✓"
            )}
          </span>
        )}
      </div>
    </div>
  );
}
