import axios from "./axios";

/**
 * Send UI action to backend audit log
 */
export async function logUIAction(action, target, details = {}) {
  try {
    await axios.post("/api/audit-logs/ui", {
      action,
      target,
      details,
      clientTime: new Date().toISOString(),
    });
  } catch (err) {
    console.warn("UI Log Failed:", err.message);
  }
}