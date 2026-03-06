"use client";

import { useState, useMemo } from "react";
import { useChat } from "@/context/ChatContext";

export default function ChatSidebar() {

  const {
    users = [],
    activeUser,
    setActiveUser,
    lastMessages = {},
    unread = {},
    onlineUsers = {},
    typingUsers = {},
  } = useChat() || {};

  const [search, setSearch] = useState("");

  /* ============ MERGE + SORT ============ */

  const list = useMemo(() => {

    let arr = users.map((u) => ({
      ...u,
      last: lastMessages[u._id]?.text || "",
      time: lastMessages[u._id]?.time || 0,
      unread: unread[u._id] || 0,
    }));

    if (search) {
      arr = arr.filter((u) =>
        u.name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    arr.sort((a, b) => {
      if (b.unread !== a.unread) return b.unread - a.unread;
      return b.time - a.time;
    });

    return arr;

  }, [users, lastMessages, unread, search]);

  return (
   <div
className="
w-full
sm:w-full
md:w-64
lg:w-72
xl:w-80
h-full
flex
flex-col
border-r
border-gray-200
dark:border-gray-700
bg-white
dark:bg-[#1e293b]
"
>

      {/* SEARCH */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search user..."
          className="
          w-full 
          px-3 
          py-2 
          rounded 
          border 
          border-gray-300 
          dark:border-gray-600
          text-sm 
          text-gray-900 
          dark:text-white
          placeholder-gray-400
          bg-white 
          dark:bg-[#0f172a]
          "
        />
      </div>

      {/* USER LIST */}
      <div className="flex-1 overflow-y-auto">

        {list.map((u) => (
          <div
            key={u._id}
            onClick={() => setActiveUser?.(u)}
            className={`
              p-3 
              cursor-pointer 
              border-b 
              border-gray-200 
              dark:border-gray-700
              flex 
              justify-between 
              items-center 
              transition
              hover:bg-gray-100 
              dark:hover:bg-[#334155]
              ${u.unread ? "font-semibold" : ""}
              ${activeUser?._id === u._id ? "bg-blue-100 dark:bg-blue-900" : ""}
            `}
          >
            <div className="min-w-0">

              {/* NAME + ONLINE */}
              <div className="flex items-center gap-2 truncate text-gray-900 dark:text-white">

                <span
                  className={`w-2 h-2 rounded-full ${
                    onlineUsers?.[u._id]
                      ? "bg-green-500"
                      : "bg-gray-400"
                  }`}
                />

                <span className="truncate">{u.name}</span>

              </div>

              {/* PREVIEW */}
              <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {typingUsers?.[u._id] ? "Typing..." : u.last}
              </div>

            </div>

            {/* UNREAD BADGE */}
            {u.unread > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">
                {u.unread > 9 ? "9+" : u.unread}
              </span>
            )}

          </div>
        ))}

      </div>
    </div>
  );
}