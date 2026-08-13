import type { NotificationItem } from "@/api";

export const NOTIFICATIONS_CHANGED_EVENT = "agrisense:notifications-changed";

export function emitNotificationsChanged() {
  window.dispatchEvent(new Event(NOTIFICATIONS_CHANGED_EVENT));
}

export function getNotificationRows(data: unknown): NotificationItem[] {
  if (!data || typeof data !== "object") return [];
  const record = data as Record<string, unknown>;
  const items = record.notifications ?? record.items ?? record.data;
  return Array.isArray(items) ? (items as NotificationItem[]) : [];
}

export function isNotificationUnread(item: NotificationItem): boolean {
  return !(item.isRead ?? item.read);
}

export function getNotificationBody(item: NotificationItem): string {
  return item.message || item.content || "No details provided.";
}

export function getNotificationTitle(item: NotificationItem): string {
  return item.title || item.type || "Notification";
}

export function formatNotificationTime(value?: string): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const diffMs = Date.now() - date.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}
