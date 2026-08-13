import { useEffect, useMemo, useState } from "react";
import RoleLayout from "../RoleLayout";
import { Panel, Badge, PaginationControls, getPaginationMeta } from "../ui";
import { ADMIN_ACCENT, adminLinks } from "./config";
import { adminService, ApiError, type AdminUserRole, type AdminUserSummary } from "@/api";
import { useAuth } from "@/context/useAuth";
import { getUserDisplayName } from "@/lib/user";

const PAGE_SIZE = 20;

const roleColor: Record<string, "green" | "amber" | "red" | "blue" | "gray" | "purple"> = {
  FARMER: "green",
  SUPPLIER: "blue",
  NGO: "purple",
  GOVERNMENT: "amber",
  ADMIN: "gray",
  Farmer: "green",
  Supplier: "blue",
  Admin: "gray",
};

const statusColor: Record<string, "green" | "amber" | "red" | "gray"> = {
  ACTIVE: "green",
  PENDING: "amber",
  SUSPENDED: "amber",
  BANNED: "red",
  DELETED: "gray",
  active: "green",
  pending: "amber",
  suspended: "amber",
  banned: "red",
  deleted: "gray",
};

const ROLES = ["ALL", "FARMER", "SUPPLIER", "NGO", "GOVERNMENT", "ADMIN"] as const;
const STATUSES = ["ALL", "ACTIVE", "PENDING", "SUSPENDED", "BANNED", "DELETED"] as const;

function accountStatusLabel(user: AdminUserSummary) {
  if (user.deletedAt) return "DELETED";
  return String(user.status || "UNKNOWN").toUpperCase();
}

function getUsers(data: unknown): AdminUserSummary[] {
  if (!data || typeof data !== "object") return [];
  const record = data as Record<string, unknown>;
  const items = record.users ?? record.items ?? record.data;
  return Array.isArray(items) ? (items as AdminUserSummary[]) : [];
}

function isProtectedTarget(actorId: string | undefined, target: AdminUserSummary) {
  if (actorId && target.id === actorId) return true;
  return String(target.role || "").toUpperCase() === "ADMIN";
}

const AdminUsers = () => {
  const { user } = useAuth();
  const [role, setRole] = useState<(typeof ROLES)[number]>("ALL");
  const [status, setStatus] = useState<(typeof STATUSES)[number]>("ALL");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [users, setUsers] = useState<AdminUserSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Users | Admin | AGRISENSE";
  }, []);

  const load = async (nextPage = page) => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminService.getUsers({
        page: nextPage,
        limit: PAGE_SIZE,
        role: role === "ALL" ? undefined : (role as AdminUserRole),
        status: status === "ALL" || status === "DELETED" ? undefined : status,
        search: query.trim() || undefined,
        includeDeleted: status === "DELETED",
      });
      const rows = getUsers(res);
      const meta = getPaginationMeta(res, nextPage, PAGE_SIZE, rows.length);
      setUsers(rows);
      setPage(meta.page);
      setTotalPages(meta.totalPages);
      setTotal(meta.total);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, status]);

  const rows = useMemo(() => users, [users]);

  const runAction = async (
    target: AdminUserSummary,
    task: () => Promise<unknown>,
    okMsg?: string,
  ) => {
    setInfo(null);
    if (isProtectedTarget(user?.id, target)) {
      setError("You cannot modify your own account or another admin.");
      return;
    }
    try {
      await task();
      if (okMsg) setInfo(okMsg);
      await load(page);
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
      subtitle="Suspend pauses login but keeps community posts. Ban hides community presence. Delete removes them from the platform while keeping their email reserved."
    >
      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {info && (
        <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {info}
        </div>
      )}
      <Panel>
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setPage(1);
                load(1);
              }
            }}
            placeholder="Search by name, email, or phone"
            className="h-10 rounded-lg border border-gray-200 px-3 text-sm outline-none"
          />
          <button
            onClick={() => {
              setPage(1);
              load(1);
            }}
            className="rounded-lg bg-[#4338CA] px-4 py-2 text-sm font-semibold text-white"
          >
            Search / Refresh
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
                  <td colSpan={6} className="py-10 text-center text-gray-500">
                    Loading users...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                rows.map((u) => {
                  const protectedRow = isProtectedTarget(user?.id, u);
                  const statusKey = accountStatusLabel(u);
                  const isDeleted = Boolean(u.deletedAt);
                  return (
                    <tr key={u.id} className="border-b last:border-0">
                      <td className="py-3 text-gray-700">
                        <p className="font-medium">{getUserDisplayName(u)}</p>
                        <p className="text-xs text-gray-400">{u.id}</p>
                      </td>
                      <td className="py-3 text-gray-500">{u.email || "—"}</td>
                      <td className="py-3">
                        <Badge color={roleColor[u.role || ""] || "gray"}>
                          {u.role || "Unknown"}
                        </Badge>
                      </td>
                      <td className="py-3">
                        <Badge color={statusColor[statusKey] || "amber"}>
                          {statusKey}
                        </Badge>
                      </td>
                      <td className="py-3 text-gray-500">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                      </td>
                      <td className="py-3">
                        {protectedRow ? (
                          <span className="text-xs text-gray-400">Protected</span>
                        ) : (
                          <div className="flex max-w-md flex-wrap gap-2">
                            {isDeleted ? (
                              <button
                                onClick={() =>
                                  runAction(
                                    u,
                                    () => adminService.restoreUser(u.id),
                                    "User restored.",
                                  )
                                }
                                className="rounded-md border px-2 py-1 text-xs font-semibold"
                              >
                                Restore
                              </button>
                            ) : (
                              <>
                                {statusKey === "SUSPENDED" || statusKey === "BANNED" ? (
                                  <button
                                    onClick={() =>
                                      runAction(
                                        u,
                                        () => adminService.reactivateUser(u.id),
                                        statusKey === "BANNED"
                                          ? "User unbanned."
                                          : "User reactivated.",
                                      )
                                    }
                                    className="rounded-md border px-2 py-1 text-xs font-semibold"
                                  >
                                    {statusKey === "BANNED" ? "Unban" : "Reactivate"}
                                  </button>
                                ) : (
                                  <button
                                    onClick={() =>
                                      runAction(
                                        u,
                                        () => adminService.suspendUser(u.id),
                                        "User suspended. They cannot log in, but posts stay visible.",
                                      )
                                    }
                                    className="rounded-md border px-2 py-1 text-xs font-semibold"
                                  >
                                    Suspend
                                  </button>
                                )}
                                {statusKey !== "BANNED" ? (
                                  <button
                                    onClick={() =>
                                      runAction(
                                        u,
                                        () => adminService.banUser(u.id),
                                        "User banned. Community posts are now hidden.",
                                      )
                                    }
                                    className="rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-800"
                                  >
                                    Ban
                                  </button>
                                ) : null}
                                <button
                                  onClick={() =>
                                    runAction(
                                      u,
                                      () => adminService.verifyUserEmail(u.id),
                                      "Email verified.",
                                    )
                                  }
                                  className="rounded-md border px-2 py-1 text-xs font-semibold"
                                >
                                  Verify email
                                </button>
                                <button
                                  onClick={() =>
                                    runAction(
                                      u,
                                      () => adminService.resetUserPassword(u.id),
                                      "Password reset triggered.",
                                    )
                                  }
                                  className="rounded-md border px-2 py-1 text-xs font-semibold"
                                >
                                  Reset password
                                </button>
                                <button
                                  onClick={() =>
                                    runAction(u, () =>
                                      adminService.updateUserRole(
                                        u.id,
                                        u.role === "SUPPLIER" ? "FARMER" : "SUPPLIER",
                                      ),
                                    )
                                  }
                                  className="rounded-md border px-2 py-1 text-xs font-semibold"
                                >
                                  Toggle role
                                </button>
                                <button
                                  onClick={() =>
                                    runAction(
                                      u,
                                      () => adminService.softDeleteUser(u.id),
                                      "User deleted. Email stays reserved so they cannot re-register.",
                                    )
                                  }
                                  className="rounded-md border border-red-200 bg-red-50 px-2 py-1 text-xs font-semibold text-red-600"
                                >
                                  Delete
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <PaginationControls
          page={page}
          totalPages={totalPages}
          total={total}
          limit={PAGE_SIZE}
          disabled={loading}
          onPageChange={(next) => load(next)}
        />
      </Panel>
    </RoleLayout>
  );
};

export default AdminUsers;
