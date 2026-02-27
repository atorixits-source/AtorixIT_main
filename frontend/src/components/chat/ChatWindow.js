"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { fetchMessages, fetchConversations } from "@/lib/chatApi";
import { useChat } from "@/context/ChatContext";
import { getCurrentUser } from "@/lib/auth";
import MessageInput from "./MessageInput";
import MessageBubble from "./MessageBubble";

export default function ChatWindow({ activeUser, hideHeader = false }) {

  const chat = useChat() || {};

  const {
    messages = [],
    setMessages = () => {},
    sendMessage = () => {},
    sendRaw = () => {},
    connected = false,
    typingUsers = {},
  } = chat;

  const [history, setHistory] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const bottomRef = useRef(null);

  /* ================= CURRENT USER ================= */

  useEffect(() => {
    const me = getCurrentUser();
    if (me) setCurrentUser(me);
  }, []);

  /* ================= LOAD HISTORY ================= */

  useEffect(() => {

    if (!activeUser?._id) return;

    let mounted = true;

    const load = async () => {
      try {

        const convoRes = await fetchConversations(
          `?user=${activeUser._id}`
        );

        if (!convoRes?.data?.length) {
          if (mounted) {
            setHistory([]);
            setMessages([]);
          }
          return;
        }

        const convoId = convoRes.data[0]._id;

        const msgRes = await fetchMessages(convoId);

        if (mounted) {
          setHistory(msgRes?.data || []);
          setMessages([]);
        }

        // Mark as read
        sendRaw({
          type: "READ_MESSAGE",
          conversationId: convoId,
        });

      } catch (err) {
        console.error("Chat history load failed:", err);
      }
    };

    load();

    return () => {
      mounted = false;
    };

  }, [activeUser?._id]);

  /* ================= AUTO SCROLL ================= */

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [history, messages]);

  /* ================= MERGE ================= */

  const allMessages = useMemo(() => {

    if (!activeUser?._id) return [];

    return [...history, ...messages]
      .filter((m) =>
        m.sender === activeUser._id ||
        m.receiver === activeUser._id
      )
      .sort(
        (a, b) =>
          new Date(a.createdAt) -
          new Date(b.createdAt)
      );

  }, [history, messages, activeUser?._id]);

  /* ================= EMPTY STATE ================= */

  if (!activeUser) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Select a user to start chatting
      </div>
    );
  }

  /* ================= MAIN ================= */

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-800">

      {/* HEADER */}
      {!hideHeader && (
        <div className="shrink-0 p-4 border-b dark:border-gray-700 font-semibold flex justify-between items-center">
          <span>{activeUser.name}</span>

          {typingUsers?.[activeUser._id] && (
            <span className="text-xs text-blue-500 animate-pulse">
              Typing...
            </span>
          )}
        </div>
      )}

      {/* MESSAGES */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-3 space-y-3">

        {allMessages.map((m) => (
          <MessageBubble
            key={m._id}
            message={m}
            currentUser={currentUser}
          />
        ))}

        <div ref={bottomRef} />
      </div>

      {/* CONNECTION STATUS */}
      {!connected && (
        <div className="shrink-0 p-2 text-xs text-red-500 text-center">
          Connecting to chat server...
        </div>
      )}

      {/* INPUT */}
      <div className="shrink-0 border-t dark:border-gray-700">
        <MessageInput
          onSend={(t) => {
            if (!t?.trim()) return;
            sendMessage(activeUser._id, t);
          }}
        />
      </div>

    </div>
  );
}