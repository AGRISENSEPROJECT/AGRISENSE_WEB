import { useCallback, useEffect, useMemo, useState } from "react";
import { Bell, CheckCheck, Loader2, Trash2 } from "lucide-react";
import { ApiError, notificationService, type NotificationItem } from "@/api";
import {
  emitNotificationsChanged,
  formatNotificationTime,
  getNotificationBody,
  getNotificationRows,
  getNotificationTitle,
  isNotificationUnread,
} from "./helpers";

interface NotificationsInboxProps {
  accent?: string;
}

export function NotificationsInbox({ accent = "#2C6E49" }: NotificationsInboxProps) {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await notificationService.list({ page: 1, limit: 50 });
      setItems(getNotificationRows(res));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = "Notifications | AGRISENSE";
    load();
  }, [load]);

  const unreadCount = useMemo(
    () => items.filter((item) => isNotificationUnread(item)).length,
    [items],
  );

  const markRead = async (id: string) => {
    setActionError(null);
    try {
      await notificationService.markRead(id);
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, isRead: true, read: true } : item)),
      );
      emitNotificationsChanged();
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "Could not mark as read.");
    }
  };

  const markAllRead = async () => {
    setActionError(null);
    try {
      await notificationService.markAllRead();
      setItems((prev) => prev.map((item) => ({ ...item, isRead: true, read: true })));
      emitNotificationsChanged();
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "Could not mark all as read.");
    }
  };

  const remove = async (id: string) => {
    setActionError(null);
    try {
      await notificationService.deleteOne(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
      emitNotificationsChanged();
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "Could not delete notification.");
    }
  };

  const clearAll = async () => {
    setActionError(null);
    try {
      await notificationService.clearAll();
      setItems([]);
      emitNotificationsChanged();
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "Could not clear notifications.");
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-gray-500">
            {unreadCount > 0 ? `${unreadCount} unread` : "No unread notifications"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={markAllRead}
            disabled={unreadCount === 0}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 disabled:opacity-40"
          >
            Mark all read
          </button>
          <button
            type="button"
            onClick={clearAll}
            disabled={items.length === 0}
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 disabled:opacity-40"
          >
            Clear all
          </button>
        </div>
      </div>

      {(error || actionError) && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error || actionError}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin" style={{ color: accent }} />
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-14 text-center">
          <Bell className="mx-auto mb-3 h-10 w-10 text-gray-300" />
          <p className="font-medium text-gray-700">No notifications yet</p>
          <p className="mt-1 text-sm text-gray-500">
            Alerts about farms, orders, and account activity will show up here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const unread = isNotificationUnread(item);
            return (
              <div
                key={item.id}
                className={`rounded-2xl border bg-white p-4 shadow-sm ${
                  unread ? "border-emerald-200" : "border-gray-200"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 gap-3">
                    <div
                      className="rounded-xl p-2"
                      style={{ backgroundColor: `${accent}14`, color: accent }}
                    >
                      <Bell className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-900">
                        {getNotificationTitle(item)}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        {getNotificationBody(item)}
                      </p>
                      <p className="mt-2 text-xs text-gray-400">
                        {formatNotificationTime(item.createdAt) ||
                          (item.createdAt ? new Date(item.createdAt).toLocaleString() : "")}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    {unread && (
                      <button
                        type="button"
                        onClick={() => markRead(item.id)}
                        className="rounded-lg border border-emerald-200 bg-emerald-50 p-2 text-emerald-700"
                        aria-label="Mark as read"
                      >
                        <CheckCheck className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => remove(item.id)}
                      className="rounded-lg border border-red-200 bg-red-50 p-2 text-red-600"
                      aria-label="Delete notification"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
