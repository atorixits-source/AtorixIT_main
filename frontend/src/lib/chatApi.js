import { apiRequest } from "./api";

export const fetchChatUsers = () =>
  apiRequest("/api/chat/users");

export const fetchConversations = (q = "") =>
  apiRequest(`/api/chat/conversations${q}`);

export const fetchMessages = (conversationId) =>
  apiRequest(`/api/chat/messages/${conversationId}`);

export const fetchUnread = () =>
  apiRequest("/api/chat/unread");
