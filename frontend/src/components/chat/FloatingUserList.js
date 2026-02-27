"use client";

import { motion } from "framer-motion";
import { X, Search } from "lucide-react";
import { useChat } from "@/context/ChatContext";
import { useState, useMemo } from "react";

export default function FloatingUserList({ onSelectUser, onClose }) {

  const {
    users,
    lastMessages,
    onlineUsers,
    typingUsers,
    unread,
  } = useChat();

  const [search, setSearch] = useState("");

  const sorted = useMemo(() => {

    let arr = users.map(u => ({
      ...u,
      last: lastMessages[u._id]?.text || "",
      time: lastMessages[u._id]?.time || 0,
      unread: unread[u._id] || 0,
    }));

    if (search) {
      arr = arr.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    arr.sort((a, b) => {
      if (b.unread !== a.unread) {
        return b.unread - a.unread;
      }
      return b.time - a.time;
    });

    return arr;

  }, [users, lastMessages, unread, search]);

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 50, opacity: 0 }}
      className="
        w-80 h-[420px]
        bg-white dark:bg-gray-900
        rounded-xl shadow-2xl
        border border-gray-200 dark:border-gray-700
        flex flex-col
      "
    >
      {/* HEADER */}
      <div className="flex justify-between items-center p-3 border-b border-gray-200 dark:border-gray-700 font-semibold text-gray-900 dark:text-white">
        Messages
        <X className="cursor-pointer" size={18} onClick={onClose} />
      </div>

      {/* SEARCH */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded px-2">
          <Search size={16} className="text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="w-full bg-transparent outline-none px-2 py-1 text-sm text-gray-800 dark:text-white"
          />
        </div>
      </div>

      {/* LIST */}
      <div className="flex-1 overflow-y-auto">

        {sorted.map((u) => (
          <div
            key={u._id}
            onClick={() => onSelectUser(u)}
            className="
              px-4 py-3
              cursor-pointer
              border-b border-gray-100 dark:border-gray-800
              hover:bg-gray-100 dark:hover:bg-gray-800
              transition
            "
          >
            <div className="flex justify-between items-center">

              <div className="flex items-center gap-2">

                <span
                  className={`w-2 h-2 rounded-full ${
                    onlineUsers?.[u._id]
                      ? "bg-green-500"
                      : "bg-gray-400"
                  }`}
                />

                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {u.name}
                </span>

              </div>

              {u.unread > 0 && (
                <span className="text-xs bg-red-500 text-white rounded-full px-2 py-0.5">
                  •
                </span>
              )}

            </div>

            <div className="text-xs text-gray-500 truncate mt-1">
              {typingUsers?.[u._id]
                ? "Typing..."
                : u.last}
            </div>

          </div>
        ))}

      </div>
    </motion.div>
  );
}
