"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";
import FloatingUserList from "./FloatingUserList";
import FloatingChatWindow from "./FloatingChatWindow";
import { useChat } from "@/context/ChatContext";

export default function FloatingMessengerManager() {

  const { setActiveUser, unread } = useChat();

  const [isUserListOpen, setIsUserListOpen] = useState(false);

  const [openChats, setOpenChats] = useState([]);
  // { user, minimized }

  const toggleUserList = () => {
    setIsUserListOpen(p => !p);
  };

  const openChat = (user) => {

    // ✅ Sync with ChatContext
    setActiveUser(user);

    setOpenChats((prev) => {

      const exists = prev.find(
        (c) => c.user._id === user._id
      );

      if (exists) {
        return prev.map((c) =>
          c.user._id === user._id
            ? { ...c, minimized: false }
            : c
        );
      }

      return [...prev, { user, minimized: false }];
    });

    // ❌ DO NOT AUTO CLOSE LIST
    // setIsUserListOpen(false);
  };

  const minimizeChat = (userId) => {
    setOpenChats((prev) =>
      prev.map((c) =>
        c.user._id === userId
          ? { ...c, minimized: true }
          : c
      )
    );
  };

  const expandChat = (userId) => {
    setOpenChats((prev) =>
      prev.map((c) =>
        c.user._id === userId
          ? { ...c, minimized: false }
          : c
      )
    );
  };

  const closeChat = (userId) => {
    setOpenChats((prev) =>
      prev.filter((c) => c.user._id !== userId)
    );
  };
  const totalUnread = Object.keys(unread || {})
    .filter(k => unread[k] > 0)
    .length;



  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex items-end gap-3">

      {/* CHAT WINDOWS */}
      <AnimatePresence>
        {openChats.map((chat) => (
          <FloatingChatWindow
            key={chat.user._id}
            user={chat.user}
            minimized={chat.minimized}
            onMinimize={() => minimizeChat(chat.user._id)}
            onExpand={() => expandChat(chat.user._id)}
            onClose={() => closeChat(chat.user._id)}
          />
        ))}
      </AnimatePresence>

      {/* USER LIST */}
      <AnimatePresence>
        {isUserListOpen && (
          <FloatingUserList
            onSelectUser={openChat}
            onClose={() => setIsUserListOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* MAIN BUTTON */}
      <motion.button
        onClick={toggleUserList}
        whileTap={{ scale: 0.9 }}
        className="relative w-14 h-14 rounded-full bg-blue-600 shadow-xl flex items-center justify-center text-white"
      >
        <MessageCircle size={22} />
        {/* BADGE */}
        {totalUnread > 0 && (
          <span
            className="
              absolute
              -top-1 -right-1
              w-6 h-6
              bg-red-500
              text-white
              text-xs
              font-bold
              rounded-full
              flex items-center justify-center
              animate-pulse
            "
          >
            {totalUnread > 9 ? "9+" : totalUnread}
          </span>
        )}
      </motion.button>

    </div>
  );
}
 