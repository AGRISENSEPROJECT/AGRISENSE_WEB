import DashboardLayout from "./DashboardLayout";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Bell, CheckCheck, Loader2, Trash2 } from "lucide-react";
import { ApiError, notificationService, type NotificationItem } from "@/api";

function getNotifications(data: unknown): NotificationItem[] {
  if (!data || typeof data !== "object") return [];
  const record = data as Record<string, unknown>;
  const items = record.notifications ?? record.items ?? record.data;
  return Array.isArray(items) ? (items as NotificationItem[]) : [];
}

export default function Notifications() {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await notificationService.list({ limit: 50 });
      setItems(getNotifications(res));
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
    () => items.filter((item) => !(item.isRead ?? item.read)).length,
    [items],
  );

  const markRead = async (id: string) => {
    await notificationService.markRead(id);
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isRead: true, read: true } : item)),
    );
  };

  const remove = async (id: string) => {
    await notificationService.deleteOne(id);
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl space-y-6 p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-[#0B6E4F]">Notifications</h1>
            <p className="text-sm text-gray-500">{unreadCount} unread notifications</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={async () => {
                await notificationService.markAllRead();
                setItems((prev) => prev.map((item) => ({ ...item, isRead: true, read: true })));
              }}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700"
            >
              Mark all read
            </button>
            <button
              onClick={async () => {
                await notificationService.clearAll();
                setItems([]);
              }}
              className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600"
            >
              Clear all
            </button>
          </div>
        </div>

        {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-[#2C6E49]" />
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-dashed bg-white p-10 text-center text-gray-500">
            No notifications yet.
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => {
              const unread = !(item.isRead ?? item.read);
              return (
                <div
                  key={item.id}
                  className={`rounded-2xl border bg-white p-4 shadow-sm ${
                    unread ? "border-green-200" : "border-gray-200"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex gap-3">
                      <div className="rounded-xl bg-green-100 p-2 text-[#2C6E49]">
                        <Bell className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {item.title || item.type || "Notification"}
                        </h3>
                        <p className="mt-1 text-sm text-gray-600">
                          {item.message || item.content || "No details provided."}
                        </p>
                        <p className="mt-2 text-xs text-gray-400">
                          {item.createdAt ? new Date(item.createdAt).toLocaleString() : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {unread && (
                        <button
                          onClick={() => markRead(item.id)}
                          className="rounded-lg border border-green-200 bg-green-50 p-2 text-green-700"
                          aria-label="Mark as read"
                        >
                          <CheckCheck className="h-4 w-4" />
                        </button>
                      )}
                      <button
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
    </DashboardLayout>
  );
}
