import { api } from "../client";
import type { MessageResponse, NotificationListResponse } from "../types";

function buildQuery(params: Record<string, string | number | boolean | undefined>): string {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      search.append(key, String(value));
    }
  });
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export const notificationService = {
  list: (
    params: {
      type?: string;
      unreadOnly?: boolean;
      page?: number;
      limit?: number;
    } = {},
  ) => api.get<NotificationListResponse>(`/notifications${buildQuery(params)}`),

  getUnreadCount: () => api.get<{ count?: number; unreadCount?: number }>("/notifications/unread-count"),

  markAllRead: () => api.patch<MessageResponse>("/notifications/read-all", {}),

  markRead: (id: string) => api.patch<MessageResponse>(`/notifications/${id}/read`, {}),

  deleteOne: (id: string) => api.delete<MessageResponse>(`/notifications/${id}`),

  clearAll: () => api.delete<MessageResponse>("/notifications"),
};
