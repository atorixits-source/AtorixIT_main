"use client";

import { motion } from "framer-motion";
import { Minus, X, Maximize2 } from "lucide-react";
import ChatWindow from "./ChatWindow";
import { useChat } from "@/context/ChatContext";

export default function FloatingChatWindow({
  user,
  minimized,
  onMinimize,
  onExpand,
  onClose,
}) {

  const { onlineUsers, typingUsers } = useChat();

  const isOnline = onlineUsers?.[user._id];
  const isTyping = typingUsers?.[user._id];

  /* ================= MINIMIZED ================= */

  if (minimized) {
    return (
      <motion.div
        layout
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        onClick={onExpand}
        className="
          w-12 h-12 rounded-full
          bg-blue-600
          flex items-center justify-center
          text-white
          cursor-pointer
          shadow-lg
        "
      >
        {user.name.charAt(0)}
      </motion.div>
    );
  }

  /* ================= WINDOW ================= */

  return (
    <motion.div
      layout
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 60, opacity: 0 }}
      className="
        w-80 h-[450px]
        bg-gray-900
        rounded-xl
        shadow-2xl
        border border-gray-700
        flex flex-col
        overflow-hidden
      "
    >

      {/* HEADER (STICKY) */}
      <div
        className="
          sticky top-0 z-20
          flex justify-between items-center
          px-3 py-2
          bg-gray-800
          text-white
          border-b border-gray-700
        "
      >

        {/* USER INFO */}
        <div className="flex flex-col">

          <span className="font-semibold text-sm">
            {user.name}
          </span>

          <span className="text-xs text-gray-400">

            {isTyping
              ? "Typing..."
              : isOnline
              ? "Online"
              : "Offline"}

          </span>

        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-2">

          <Minus
            size={16}
            className="cursor-pointer hover:text-blue-400"
            onClick={onMinimize}
          />

          <Maximize2
            size={16}
            className="cursor-pointer hover:text-blue-400"
          />

          <X
            size={16}
            className="cursor-pointer hover:text-red-400"
            onClick={onClose}
          />

        </div>
      </div>

      {/* CHAT BODY */}
      <div className="flex-1 overflow-hidden">
        <ChatWindow activeUser={user} hideHeader />
      </div>

    </motion.div>
  );
}
