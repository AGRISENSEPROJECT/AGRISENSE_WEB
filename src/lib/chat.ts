import type { AuthUser, ChatMessage, ChatUserSummary, Conversation } from "@/api";
import { getUserDisplayName } from "@/lib/user";

export function messageSender(message: ChatMessage): ChatUserSummary | null {
  return message.sender || message.author || message.user || null;
}

export function messageSenderId(message: ChatMessage): string | null {
  const sender = messageSender(message);
  return message.senderId || sender?.id || (message as { userId?: string }).userId || null;
}

export function isOwnMessage(message: ChatMessage, currentUserId?: string): boolean {
  if (!currentUserId) return false;
  return messageSenderId(message) === currentUserId;
}

export function conversationMembers(conversation?: Conversation | null): ChatUserSummary[] {
  if (!conversation) return [];
  if (Array.isArray(conversation.participants) && conversation.participants.length) {
    return conversation.participants;
  }
  if (!Array.isArray(conversation.members)) return [];
  return conversation.members
    .map((member) => member.user || ({ id: member.userId || "" } as ChatUserSummary))
    .filter((user) => Boolean(user.id));
}

export function conversationTitle(
  conversation: Conversation | null | undefined,
  currentUserId?: string,
): string {
  if (!conversation) return "Chat";
  const type = String(conversation.type || "").toLowerCase();
  if (type === "group" || conversation.name) {
    return conversation.name?.trim() || "Group chat";
  }
  const others = conversationMembers(conversation).filter((user) => user.id !== currentUserId);
  if (others.length) return getUserDisplayName(others[0]);
  return "Direct chat";
}

export function conversationSubtitle(conversation: Conversation, currentUserId?: string): string {
  const type = String(conversation.type || "").toLowerCase();
  if (type === "group") {
    const count = conversationMembers(conversation).length;
    return count ? `${count} members` : "Group";
  }
  const others = conversationMembers(conversation).filter((user) => user.id !== currentUserId);
  return others[0]?.email || "Direct message";
}

export function lastMessagePreview(conversation: Conversation): string {
  const last = conversation.lastMessage;
  if (!last) return "No messages yet";
  if (last.deletedAt) return "Message deleted";
  return (last.content || "").trim() || "Attachment";
}

export function formatChatTime(value?: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const now = new Date();
  const sameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();
  if (sameDay) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

export function initialsFromUser(user?: ChatUserSummary | AuthUser | null): string {
  const name = getUserDisplayName(user);
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return (parts[0]?.slice(0, 2) || "?").toUpperCase();
}
