// hooks/useKeepAlive.js
// Add this to your root layout or _app.js to prevent Render cold starts
// Usage: call useKeepAlive() in your AdminLayout or root component

import { useEffect } from "react";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "https://atorix-backend-server.onrender.com";
const PING_INTERVAL_MS = 14 * 60 * 1000; // 14 minutes (Render sleeps after 15min)

export function useKeepAlive() {
  useEffect(() => {
    const ping = async () => {
      try {
        await fetch(`${BACKEND_URL}/api/ping`, { method: "GET" });
        console.log("[KeepAlive] Server pinged ✓");
      } catch {
        // Silent fail — server may be waking up
      }
    };

    // Ping immediately on mount
    ping();

    // Then ping every 14 minutes
    const interval = setInterval(ping, PING_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);
}