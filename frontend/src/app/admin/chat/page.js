"use client";

import { useEffect, useState } from "react";

import AdminLayout from "@/components/admin/AdminLayout";
import { fetchChatUsers } from "@/lib/chatApi";
import ChatWindow from "@/components/chat/ChatWindow";
import ChatSidebar from "@/components/chat/ChatSidebar";
import { getCurrentUser } from "@/lib/auth";
import { useChat } from "@/context/ChatContext";

export default function ChatPage() {

  /* ================= CONTEXT ================= */
  const { activeUser } = useChat();

  /* ================= STATE ================= */
  const [users, setUsers] = useState([]);

  /* ================= LOAD USERS ================= */
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const me = getCurrentUser();
      const res = await fetchChatUsers();

      if (res?.success && Array.isArray(res.data)) {
        const filtered = res.data.filter((u) => u._id !== me?._id);
        setUsers(filtered);
      }

    } catch (err) {
      console.error("Failed to load chat users:", err);
    }
  };

  /* ================= RENDER ================= */
  return (
    <AdminLayout title="Internal Chat">

      {/* Outer Wrapper */}
      <div className="w-full px-4 sm:px-6 lg:px-8">

        {/* Chat Container */}
        <div
          className="
          mx-auto 
          max-w-7xl 
          h-[75vh] sm:h-[80vh] 
          rounded-xl 
          shadow-lg 
          flex 
          flex-col 
          md:flex-row 
          overflow-hidden
          bg-white dark:bg-[#1e293b]
          border border-gray-200 dark:border-gray-700
          "
        >

          {/* ================= SIDEBAR ================= */}
          <div
            className="
            w-full 
            md:w-80 
            border-b 
            md:border-b-0 
            md:border-r 
            border-gray-200 
            dark:border-gray-700 
            overflow-y-auto
            bg-white dark:bg-[#1e293b]
            "
          >
            <ChatSidebar users={users} />
          </div>

          {/* ================= CHAT WINDOW ================= */}
          <div
            className="
            flex-1 
            flex 
            flex-col 
            overflow-hidden
            bg-white dark:bg-[#1e293b]
            "
          >
            <ChatWindow activeUser={activeUser} />
          </div>

        </div>

      </div>

    </AdminLayout>
  );
}