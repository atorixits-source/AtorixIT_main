"use client";

import { createContext, useContext, useEffect, useState } from "react";
import useChatSocket from "@/hooks/useChatSocket";
import {
  fetchChatUsers,
  fetchUnread,
  fetchConversations,
} from "@/lib/chatApi";
import { getCurrentUser } from "@/lib/auth";

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const me = getCurrentUser();

  const [users, setUsers] = useState([]);
  const [activeUser, setActiveUser] = useState(null);

  const [lastMessages, setLastMessages] = useState({});
  const [unread, setUnread] = useState({});
  const [messages, setMessages] = useState([]);

  const [onlineUsers, setOnlineUsers] = useState({});
  const [typingUsers, setTypingUsers] = useState({});
  const [deliveryStatus, setDeliveryStatus] = useState({});

  /* ================= LOAD USERS ================= */

  useEffect(() => {
    loadUsers();
    preload();
  }, []);

  const loadUsers = async () => {
    const res = await fetchChatUsers();
    if (res?.success) {
      setUsers(res.data.filter(u => u._id !== me?._id));
    }
  };

  const preload = async () => {

    const unreadRes = await fetchUnread();
    if (unreadRes?.success) {
      const map = {};
      unreadRes.data.forEach(u => {
        if (u.count > 0) {
          map[u._id] = 1; // ✅ presence based unread
        }
      });
      setUnread(map);
    }

    const convoRes = await fetchConversations();
    if (convoRes?.success) {
      const last = {};
      convoRes.data.forEach(c => {
        const other = c.participants.find(p => p._id !== me?._id);
        if (!other) return;

        last[other._id] = {
          text: c.lastMessage,
          time: new Date(c.updatedAt).getTime(),
        };
      });
      setLastMessages(last);
    }
  };

  /* ================= SOCKET ================= */

  const { sendMessage, sendRaw, connected } =
    useChatSocket((msg) => {

      if (msg.type === "NEW_MESSAGE") {

        const m = msg.data;
        setMessages(p => [...p, m]);

        const other =
          m.sender === me?._id
            ? m.receiver
            : m.sender;

        setLastMessages(p => ({
          ...p,
          [other]: {
            text: m.text,
            time: Date.now(),
          }
        }));

        // ✅ UNIQUE USER BASED UNREAD
        if (m.receiver === me?._id &&
            activeUser?._id !== other) {
          setUnread(p => ({
            ...p,
            [other]: 1,
          }));
        }
      }

      if (msg.type === "USER_ONLINE") {
        setOnlineUsers(p => ({
          ...p,
          [msg.data.userId]: true,
        }));
      }

      if (msg.type === "USER_OFFLINE") {
        setOnlineUsers(p => ({
          ...p,
          [msg.data.userId]: false,
        }));
      }

      if (msg.type === "TYPING_START") {
        setTypingUsers(p => ({
          ...p,
          [msg.data.userId]: true,
        }));
      }

      if (msg.type === "TYPING_STOP") {
        setTypingUsers(p => ({
          ...p,
          [msg.data.userId]: false,
        }));
      }

      if (msg.type === "MESSAGE_DELIVERED") {
        setDeliveryStatus(p => ({
          ...p,
          [msg.data.messageId]: "delivered",
        }));
      }

      if (msg.type === "MESSAGE_READ") {
        setDeliveryStatus(p => ({
          ...p,
          [msg.data.messageId]: "read",
        }));
      }
    });

  const openChat = (user) => {
    setActiveUser(user);
    setUnread(p => ({
      ...p,
      [user._id]: 0,
    }));
  };

  return (
    <ChatContext.Provider
      value={{
        users,
        activeUser,
        setActiveUser: openChat,
        lastMessages,
        unread,
        messages,
        setMessages,
        sendMessage,
        sendRaw,
        connected,
        onlineUsers,
        typingUsers,
        deliveryStatus,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  return useContext(ChatContext);
}
