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
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm text-gray-500">
            {unreadCount > 0
              ? `${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}`
              : "You're all caught up"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={markAllRead}
            disabled={unreadCount === 0}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-40"
          >
            <CheckCheck className="h-4 w-4" />
            Mark all read
          </button>
          <button
            type="button"
            onClick={clearAll}
            disabled={items.length === 0}
            className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-40"
          >
            <Trash2 className="h-4 w-4" />
            Clear all
          </button>
        </div>
      </div>

      {(error || actionError) && (
        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error || actionError}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin" style={{ color: accent }} />
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-gradient-to-b from-white to-gray-50 px-6 py-16 text-center">
          <div
            className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
            style={{ backgroundColor: `${accent}14`, color: accent }}
          >
            <Bell className="h-7 w-7" />
          </div>
          <p className="text-lg font-semibold text-gray-800">No notifications yet</p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500">
            Alerts about farms, orders, billing, and account activity will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          {items.map((item, index) => {
            const unread = isNotificationUnread(item);
            return (
              <div
                key={item.id}
                className={`flex items-start gap-3 px-4 py-4 transition-colors sm:px-5 ${
                  index > 0 ? "border-t border-gray-100" : ""
                } ${unread ? "bg-[#f3faf6]" : "bg-white hover:bg-gray-50/80"}`}
              >
                <div className="relative mt-0.5 shrink-0">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ backgroundColor: `${accent}14`, color: accent }}
                  >
                    <Bell className="h-4 w-4" />
                  </div>
                  {unread && (
                    <span
                      className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-white"
                      style={{ backgroundColor: accent }}
                    />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className={`text-sm text-gray-900 ${unread ? "font-bold" : "font-semibold"}`}>
                      {getNotificationTitle(item)}
                    </h3>
                    {unread && (
                      <span
                        className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white"
                        style={{ backgroundColor: accent }}
                      >
                        New
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-gray-600">
                    {getNotificationBody(item)}
                  </p>
                  <p className="mt-2 text-xs text-gray-400">
                    {formatNotificationTime(item.createdAt) ||
                      (item.createdAt ? new Date(item.createdAt).toLocaleString() : "")}
                  </p>
                </div>

                <div className="flex shrink-0 gap-1.5">
                  {unread && (
                    <button
                      type="button"
                      onClick={() => markRead(item.id)}
                      className="rounded-lg border border-gray-200 bg-white p-2 text-gray-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                      aria-label="Mark as read"
                      title="Mark as read"
                    >
                      <CheckCheck className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => remove(item.id)}
                    className="rounded-lg border border-gray-200 bg-white p-2 text-gray-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                    aria-label="Delete notification"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
