import { useEffect, useMemo, useState } from "react";
import { Store, BarChart3, Settings as SettingsIcon, Loader2, Send } from "lucide-react";
import RoleLayout from "../RoleLayout";
import { Panel, Badge } from "../ui";
import { ADMIN_ACCENT, adminLinks } from "./config";
import {
  adminService,
  ApiError,
  type AdminAuditLog,
  type AdminUserSummary,
} from "@/api";
import { getUserDisplayName } from "@/lib/user";

function getRows<T>(data: unknown, keys: string[]): T[] {
  if (!data || typeof data !== "object") return [];
  const record = data as Record<string, unknown>;
  for (const key of keys) {
    const value = record[key];
    if (Array.isArray(value)) return value as T[];
  }
  return [];
}

export const AdminSuppliers = () => {
  const [suppliers, setSuppliers] = useState<AdminUserSummary[]>([]);
  const [ngos, setNgos] = useState<AdminUserSummary[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [suppliersRes, ngosRes] = await Promise.all([
        adminService.getPendingSuppliers(),
        adminService.getPendingNgos(),
      ]);
      setSuppliers(getRows<AdminUserSummary>(suppliersRes, ["suppliers", "items", "data"]));
      setNgos(getRows<AdminUserSummary>(ngosRes, ["ngos", "items", "data"]));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load approvals.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Suppliers | Admin | AGRISENSE";
    load();
  }, []);

  const section = (
    title: string,
    rows: AdminUserSummary[],
    approve: (id: string) => Promise<unknown>,
    reject: (id: string) => Promise<unknown>,
  ) => (
    <Panel title={title}>
      {rows.length === 0 ? (
        <div className="text-sm text-gray-500">No pending records.</div>
      ) : (
        <div className="space-y-3">
          {rows.map((row) => (
            <div key={row.id} className="flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-gray-900">{getUserDisplayName(row)}</p>
                <p className="text-sm text-gray-500">{row.email || row.phoneNumber || "—"}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={async () => {
                    await approve(row.id);
                    await load();
                  }}
                  className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white"
                >
                  Approve
                </button>
                <button
                  onClick={async () => {
                    await reject(row.id);
                    await load();
                  }}
                  className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-600"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Panel>
  );

  return (
    <RoleLayout links={adminLinks} roleLabel="Admin Console" accent={ADMIN_ACCENT} title="Approvals">
      {error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-[#4338CA]" /></div>
      ) : (
        <div className="space-y-6">
          {section("Pending suppliers", suppliers, adminService.approveSupplier, (id) => adminService.rejectSupplier(id, {}))}
          {section("Pending NGOs", ngos, adminService.approveNgo, (id) => adminService.rejectNgo(id, {}))}
        </div>
      )}
    </RoleLayout>
  );
};

export const AdminAnalytics = () => {
  const [users, setUsers] = useState<AdminUserSummary[]>([]);
  const [logs, setLogs] = useState<AdminAuditLog[]>([]);
  const [farmStats, setFarmStats] = useState<Record<string, unknown>>({});

  useEffect(() => {
    document.title = "Analytics | Admin | AGRISENSE";
    (async () => {
      const [usersRes, logsRes, farmsRes] = await Promise.all([
        adminService.getUsers({ page: 1, limit: 100 }),
        adminService.getAuditLogs(1, 20),
        adminService.getFarmStatistics(),
      ]);
      setUsers(getRows<AdminUserSummary>(usersRes, ["users", "items", "data"]));
      setLogs(getRows<AdminAuditLog>(logsRes, ["logs", "items", "data"]));
      setFarmStats(farmsRes);
    })().catch(() => undefined);
  }, []);

  const statusCounts = useMemo(
    () =>
      users.reduce<Record<string, number>>((acc, user) => {
        const key = user.status || "UNKNOWN";
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {}),
    [users],
  );

  return (
    <RoleLayout links={adminLinks} roleLabel="Admin Console" accent={ADMIN_ACCENT} title="Analytics">
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Platform status overview">
          <div className="space-y-3">
            {Object.entries(statusCounts).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
                <span className="text-sm text-gray-700">{key}</span>
                <Badge color="purple">{value}</Badge>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Farm statistics">
          <div className="space-y-2 text-sm text-gray-700">
            <p>Total farms: {String(farmStats.totalFarms ?? 0)}</p>
            <p>Active farms: {String(farmStats.activeFarms ?? 0)}</p>
            <p>Archived farms: {String(farmStats.archivedFarms ?? 0)}</p>
            <p>Average size: {String(farmStats.averageFarmSize ?? 0)}</p>
          </div>
        </Panel>
        <Panel title="Recent audit activity" className="lg:col-span-2">
          <div className="space-y-2">
            {logs.map((log) => (
              <div key={log.id} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
                <span className="font-semibold text-gray-900">{log.action || "ACTION"}</span>
                <span className="ml-2 text-gray-500">
                  {log.createdAt ? new Date(log.createdAt).toLocaleString() : ""}
                </span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </RoleLayout>
  );
};

export const AdminSettings = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [info, setInfo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<AdminAuditLog[]>([]);

  const loadLogs = async () => {
    try {
      const res = await adminService.getAuditLogs(1, 20);
      setLogs(getRows<AdminAuditLog>(res, ["logs", "items", "data"]));
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    document.title = "Settings | Admin | AGRISENSE";
    loadLogs();
  }, []);

  return (
    <RoleLayout links={adminLinks} roleLabel="Admin Console" accent={ADMIN_ACCENT} title="Settings">
      <div className="space-y-6">
        {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
        {info && <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{info}</div>}
        <Panel title="Broadcast announcement">
          <div className="space-y-3">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Announcement title"
              className="h-11 w-full rounded-lg border border-gray-200 px-3"
            />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Announcement message"
              rows={4}
              className="w-full rounded-lg border border-gray-200 p-3"
            />
            <button
              onClick={async () => {
                try {
                  await adminService.broadcastAnnouncement({ title, message });
                  setInfo("Announcement sent successfully.");
                  setTitle("");
                  setMessage("");
                  await loadLogs();
                } catch (err) {
                  setError(err instanceof ApiError ? err.message : "Failed to send announcement.");
                }
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-[#4338CA] px-4 py-2 text-sm font-semibold text-white"
            >
              <Send className="h-4 w-4" />
              Broadcast
            </button>
          </div>
        </Panel>
        <Panel title="Audit logs">
          <div className="space-y-2">
            {logs.map((log) => (
              <div key={log.id} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
                <p className="font-semibold text-gray-900">{log.action || "ACTION"}</p>
                <p className="text-gray-500">{log.createdAt ? new Date(log.createdAt).toLocaleString() : ""}</p>
              </div>
            ))}
            {!logs.length && <p className="text-sm text-gray-500">No audit logs available.</p>}
          </div>
          <p className="mt-4 text-xs text-gray-500">
            Category management and system setting endpoints are not exposed in the current backend docs, so only live admin APIs are integrated here.
          </p>
        </Panel>
      </div>
    </RoleLayout>
  );
};
