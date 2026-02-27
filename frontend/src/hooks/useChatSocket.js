"use client";

import { useEffect, useState } from "react";
import { getAuthToken } from "@/lib/auth";

let globalSocket = null;

export default function useChatSocket(onMessage) {
  const [connected, setConnected] = useState(false);

  useEffect(() => {

    if (globalSocket) {
      return;
    }

    const token = getAuthToken();
    if (!token) return;

    const ws = new WebSocket("ws://localhost:5001/ws");
    globalSocket = ws;

    ws.onopen = () => {

      const queue = JSON.parse(
        localStorage.getItem("chat_queue") || "[]"
      );

      queue.forEach((msg) => {
        ws.send(JSON.stringify(msg));
      });

      localStorage.removeItem("chat_queue");

      ws.send(JSON.stringify({
        type: "AUTH",
        token,
      }));
    };

    ws.onmessage = (e) => {

      const msg = JSON.parse(e.data);

      if (msg.type === "AUTH_SUCCESS") {
        setConnected(true);
      }

      onMessage?.(msg);
    };

    ws.onclose = () => {
      globalSocket = null;
      setConnected(false);
    };

  }, []);

  const sendMessage = (receiverId, text) => {

    const payload = {
      type: "SEND_MESSAGE",
      receiverId,
      text,
    };

    if (!globalSocket ||
        globalSocket.readyState !== WebSocket.OPEN) {

      const queue = JSON.parse(
        localStorage.getItem("chat_queue") || "[]"
      );

      queue.push(payload);
      localStorage.setItem(
        "chat_queue",
        JSON.stringify(queue)
      );
      return;
    }

    globalSocket.send(JSON.stringify(payload));
  };

  const sendRaw = (data) => {

    if (
      globalSocket &&
      globalSocket.readyState === WebSocket.OPEN
    ) {
      globalSocket.send(JSON.stringify(data));
    }
  };

  return { sendMessage, sendRaw, connected };
}
