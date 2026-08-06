import { useEffect, useMemo, useState } from "react";
import RoleLayout from "../RoleLayout";
import { Panel, Badge } from "../ui";
import { ADMIN_ACCENT, adminLinks } from "./config";
import { adminService, ApiError, type AdminUserRole, type AdminUserSummary } from "@/api";
import { getUserDisplayName } from "@/lib/user";

const roleColor: Record<string, "green" | "amber" | "red" | "blue" | "gray" | "purple"> = {
  Farmer: "green",
  Supplier: "blue",
  NGO: "purple",
  Government: "amber",
  Admin: "gray",
};

const statusColor: Record<string, "green" | "amber" | "red"> = {
  active: "green",
  pending: "amber",
  suspended: "red",
};

const ROLES = ["ALL", "FARMER", "SUPPLIER", "NGO", "GOVERNMENT", "ADMIN"] as const;
const STATUSES = ["ALL", "ACTIVE", "SUSPENDED", "BANNED", "PENDING"] as const;

function getUsers(data: unknown): AdminUserSummary[] {
  if (!data || typeof data !== "object") return [];
  const record = data as Record<string, unknown>;
  const items = record.users ?? record.items ?? record.data;
  return Array.isArray(items) ? (items as AdminUserSummary[]) : [];
}

const AdminUsers = () => {
  const [role, setRole] = useState<(typeof ROLES)[number]>("ALL");
  const [status, setStatus] = useState<(typeof STATUSES)[number]>("ALL");
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<AdminUserSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Users | Admin | AGRISENSE";
  }, []);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminService.getUsers({
        page: 1,
        limit: 100,
        role: role === "ALL" ? undefined : (role as AdminUserRole),
        status: status === "ALL" ? undefined : status,
        search: query || undefined,
      });
      setUsers(getUsers(res));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [role, status]);

  const rows = useMemo(
    () =>
      users.filter((user) =>
        query
          ? [getUserDisplayName(user), user.email, user.phoneNumber]
              .filter(Boolean)
              .some((value) => value!.toLowerCase().includes(query.toLowerCase()))
          : true,
      ),
    [users, query],
  );

  const runAction = async (task: () => Promise<unknown>) => {
    try {
      await task();
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Action failed.");
    }
  };

  return (
    <RoleLayout
      links={adminLinks}
      roleLabel="Admin Console"
      accent={ADMIN_ACCENT}
      title="User Management"
      subtitle="Search, filter and manage all platform accounts."
    >
      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <Panel>
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email, or phone"
            className="h-10 rounded-lg border border-gray-200 px-3 text-sm outline-none"
          />
          <button
            onClick={load}
            className="rounded-lg bg-[#4338CA] px-4 py-2 text-sm font-semibold text-white"
          >
            Refresh
          </button>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {ROLES.map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className="rounded-full border px-3 py-1 text-xs font-medium transition-colors"
              style={
                role === r
                  ? { backgroundColor: ADMIN_ACCENT, color: "#fff", borderColor: ADMIN_ACCENT }
                  : { color: "#4b5563" }
              }
            >
              {r}
            </button>
          ))}
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className="rounded-full border px-3 py-1 text-xs font-medium transition-colors"
              style={
                status === s
                  ? { backgroundColor: "#111827", color: "#fff", borderColor: "#111827" }
                  : { color: "#4b5563" }
              }
            >
              {s}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase text-gray-400">
                <th className="pb-2 font-medium">ID</th>
                <th className="pb-2 font-medium">User</th>
                <th className="pb-2 font-medium">Email</th>
                <th className="pb-2 font-medium">Role</th>
                <th className="pb-2 font-medium">Status</th>
                <th className="pb-2 font-medium">Joined</th>
                <th className="pb-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-gray-500">
                    Loading users...
                  </td>
                </tr>
              ) : rows.map((u) => (
                <tr key={u.id} className="border-b last:border-0">
                  <td className="py-3 font-medium text-gray-800">{u.id}</td>
                  <td className="py-3 text-gray-700">{getUserDisplayName(u)}</td>
                  <td className="py-3 text-gray-500">{u.email || "—"}</td>
                  <td className="py-3">
                    <Badge color={roleColor[u.role || ""] || "gray"}>{u.role || "Unknown"}</Badge>
                  </td>
                  <td className="py-3">
                    <Badge color={statusColor[u.status || ""] || "amber"}>{u.status || "Unknown"}</Badge>
                  </td>
                  <td className="py-3 text-gray-500">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                  </td>
                  <td className="py-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() =>
                          runAction(() =>
                            adminService.updateUserStatus(
                              u.id,
                              u.status === "SUSPENDED" ? "ACTIVE" : "SUSPENDED",
                            ),
                          )
                        }
                        className="rounded-md border px-2 py-1 text-xs font-semibold"
                      >
                        {u.status === "SUSPENDED" ? "Reactivate" : "Suspend"}
                      </button>
                      <button
                        onClick={() =>
                          runAction(() =>
                            adminService.updateUserRole(
                              u.id,
                              u.role === "ADMIN" ? "FARMER" : "ADMIN",
                            ),
                          )
                        }
                        className="rounded-md border px-2 py-1 text-xs font-semibold"
                      >
                        Toggle role
                      </button>
                      <button
                        onClick={() =>
                          runAction(() =>
                            u.deletedAt
                              ? adminService.restoreUser(u.id)
                              : adminService.softDeleteUser(u.id),
                          )
                        }
                        className="rounded-md border border-red-200 bg-red-50 px-2 py-1 text-xs font-semibold text-red-600"
                      >
                        {u.deletedAt ? "Restore" : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </RoleLayout>
  );
};

export default AdminUsers;
