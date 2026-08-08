import { useEffect, useMemo, useState } from "react";
import { CreditCard, Loader2, RefreshCw, UserCog } from "lucide-react";
import RoleLayout from "../RoleLayout";
import { Badge, Panel, PaginationControls, getPaginationMeta } from "../ui";
import { ADMIN_ACCENT, adminLinks } from "./config";
import {
  ApiError,
  billingService,
  type AdminAssignSubscriptionDto,
  type BillingCycle,
  type BillingPlanId,
} from "@/api";

const PAGE_SIZE = 20;

type Tab = "subscriptions" | "transactions";

interface BillingRow {
  id?: string;
  userId?: string;
  email?: string;
  userEmail?: string;
  userName?: string;
  name?: string;
  planId?: string;
  status?: string;
  billingCycle?: string;
  paymentMethod?: string;
  paymentLabel?: string;
  amount?: number;
  currency?: string;
  method?: string;
  providerRef?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

function unwrapRows(data: unknown, keys: string[]): BillingRow[] {
  if (Array.isArray(data)) return data as BillingRow[];
  if (!data || typeof data !== "object") return [];
  const record = data as Record<string, unknown>;
  for (const key of keys) {
    const value = record[key];
    if (Array.isArray(value)) return value as BillingRow[];
  }
  return [];
}

function displayUser(row: BillingRow) {
  return (
    row.userName ||
    row.name ||
    row.userEmail ||
    row.email ||
    (row.userId ? `User ${String(row.userId).slice(0, 8)}…` : "—")
  );
}

function displayEmail(row: BillingRow) {
  return row.userEmail || row.email || "—";
}

function formatMoney(amount?: number, currency = "RWF") {
  if (typeof amount !== "number" || !Number.isFinite(amount)) return "—";
  return `${currency} ${amount.toLocaleString()}`;
}

function statusColor(status?: string): "green" | "amber" | "red" | "blue" | "gray" | "purple" {
  const s = (status || "").toLowerCase();
  if (s === "active" || s === "successful" || s === "success") return "green";
  if (s === "pending_payment" || s === "pending" || s === "initiated" || s === "trialing") {
    return "amber";
  }
  if (s === "failed" || s === "expired" || s === "canceled" || s === "past_due" || s === "banned") {
    return "red";
  }
  if (s === "pro" || s === "enterprise") return "purple";
  return "gray";
}

const AdminBilling = () => {
  const [tab, setTab] = useState<Tab>("subscriptions");
  const [rows, setRows] = useState<BillingRow[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [planFilter, setPlanFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [search, setSearch] = useState("");

  const [assignUserId, setAssignUserId] = useState("");
  const [assignPlan, setAssignPlan] = useState<BillingPlanId>("pro");
  const [assignCycle, setAssignCycle] = useState<BillingCycle>("monthly");
  const [assignDays, setAssignDays] = useState("");
  const [assignNote, setAssignNote] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async (nextPage = page, nextTab = tab) => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string | number | undefined> = {
        page: nextPage,
        limit: PAGE_SIZE,
      };
      if (planFilter) params.planId = planFilter;
      if (statusFilter) params.status = statusFilter;
      if (search.trim()) params.search = search.trim();

      const res =
        nextTab === "subscriptions"
          ? await billingService.adminListSubscriptions(params)
          : await billingService.adminListTransactions(params);

      const list = unwrapRows(
        res,
        nextTab === "subscriptions"
          ? ["subscriptions", "items", "data", "rows"]
          : ["transactions", "items", "data", "rows"],
      );
      const meta = getPaginationMeta(res, nextPage, PAGE_SIZE, list.length);
      setRows(list);
      setPage(meta.page);
      setTotalPages(meta.totalPages);
      setTotal(meta.total);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load billing data.");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Billing | Admin | AGRISENSE";
    load(1, "subscriptions");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const summary = useMemo(() => {
    const byPlan: Record<string, number> = {};
    const byStatus: Record<string, number> = {};
    rows.forEach((row) => {
      const plan = String(row.planId || "unknown");
      const status = String(row.status || "unknown");
      byPlan[plan] = (byPlan[plan] || 0) + 1;
      byStatus[status] = (byStatus[status] || 0) + 1;
    });
    return { byPlan, byStatus };
  }, [rows]);

  const switchTab = (next: Tab) => {
    setTab(next);
    setPage(1);
    load(1, next);
  };

  const runAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignUserId.trim()) {
      setError("Enter a user ID to assign a plan.");
      return;
    }
    setSaving(true);
    setError(null);
    setInfo(null);
    try {
      const dto: AdminAssignSubscriptionDto = {
        planId: assignPlan,
        note: assignNote.trim() || undefined,
      };
      if (assignPlan === "pro") dto.billingCycle = assignCycle;
      if (assignDays.trim()) dto.periodDays = Number(assignDays);
      await billingService.adminAssign(assignUserId.trim(), dto);
      setInfo(`Assigned ${assignPlan} to user ${assignUserId.trim()}.`);
      setAssignNote("");
      await load(page, tab);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to assign subscription.");
    } finally {
      setSaving(false);
    }
  };

  const runRevoke = async (userId?: string) => {
    if (!userId) return;
    if (!confirm("Revoke this subscription and return the user to Starter?")) return;
    setError(null);
    setInfo(null);
    try {
      await billingService.adminRevoke(userId, { note: "Revoked by admin" });
      setInfo("Subscription revoked. User is on Starter.");
      await load(page, tab);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to revoke subscription.");
    }
  };

  return (
    <RoleLayout
      links={adminLinks}
      roleLabel="Admin Console"
      accent={ADMIN_ACCENT}
      title="Billing"
      subtitle="Subscriptions, payments, and manual plan grants."
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

      <div className="mb-4 flex flex-wrap gap-2">
        {(
          [
            { id: "subscriptions" as const, label: "Subscriptions" },
            { id: "transactions" as const, label: "Transactions" },
          ] as const
        ).map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => switchTab(item.id)}
            className="rounded-lg border px-3 py-1.5 text-sm font-semibold"
            style={
              tab === item.id
                ? { backgroundColor: ADMIN_ACCENT, color: "#fff", borderColor: ADMIN_ACCENT }
                : { color: "#4b5563" }
            }
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Panel>
          <p className="text-xs uppercase tracking-wide text-gray-400">Rows (page)</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{rows.length}</p>
        </Panel>
        <Panel>
          <p className="text-xs uppercase tracking-wide text-gray-400">Total</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{total || rows.length}</p>
        </Panel>
        <Panel>
          <p className="text-xs uppercase tracking-wide text-gray-400">Active / success</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {(summary.byStatus.active || 0) +
              (summary.byStatus.successful || 0) +
              (summary.byStatus.success || 0)}
          </p>
        </Panel>
        <Panel>
          <p className="text-xs uppercase tracking-wide text-gray-400">Pending</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {(summary.byStatus.pending_payment || 0) + (summary.byStatus.pending || 0)}
          </p>
        </Panel>
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-3">
        <Panel title="Filters" className="lg:col-span-2">
          <div className="flex flex-wrap gap-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") load(1, tab);
              }}
              placeholder="Search email / user id"
              className="h-10 min-w-[200px] flex-1 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-[#4338CA]"
            />
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="h-10 rounded-lg border border-gray-200 px-3 text-sm"
            >
              <option value="">All plans</option>
              <option value="starter">Starter</option>
              <option value="pro">Pro</option>
              <option value="enterprise">Enterprise</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 rounded-lg border border-gray-200 px-3 text-sm"
            >
              <option value="">All statuses</option>
              <option value="active">Active</option>
              <option value="pending_payment">Pending payment</option>
              <option value="canceled">Canceled</option>
              <option value="expired">Expired</option>
              <option value="successful">Successful</option>
              <option value="failed">Failed</option>
            </select>
            <button
              type="button"
              onClick={() => load(1, tab)}
              className="inline-flex h-10 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold text-white"
              style={{ backgroundColor: ADMIN_ACCENT }}
            >
              <RefreshCw className="h-4 w-4" /> Refresh
            </button>
          </div>
        </Panel>

        <Panel title="Manual assign">
          <form onSubmit={runAssign} className="space-y-2">
            <input
              value={assignUserId}
              onChange={(e) => setAssignUserId(e.target.value)}
              placeholder="User ID *"
              className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-[#4338CA]"
            />
            <div className="grid grid-cols-2 gap-2">
              <select
                value={assignPlan}
                onChange={(e) => setAssignPlan(e.target.value as BillingPlanId)}
                className="h-10 rounded-lg border border-gray-200 px-2 text-sm"
              >
                <option value="starter">Starter</option>
                <option value="pro">Pro</option>
                <option value="enterprise">Enterprise</option>
              </select>
              <select
                value={assignCycle}
                onChange={(e) => setAssignCycle(e.target.value as BillingCycle)}
                disabled={assignPlan !== "pro"}
                className="h-10 rounded-lg border border-gray-200 px-2 text-sm disabled:opacity-50"
              >
                <option value="monthly">Monthly</option>
                <option value="annual">Annual</option>
              </select>
            </div>
            <input
              value={assignDays}
              onChange={(e) => setAssignDays(e.target.value.replace(/\D/g, ""))}
              placeholder="Period days (optional)"
              className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-[#4338CA]"
            />
            <input
              value={assignNote}
              onChange={(e) => setAssignNote(e.target.value)}
              placeholder="Note (optional)"
              className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-[#4338CA]"
            />
            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-lg text-sm font-semibold text-white disabled:opacity-60"
              style={{ backgroundColor: ADMIN_ACCENT }}
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserCog className="h-4 w-4" />}
              Assign plan
            </button>
          </form>
        </Panel>
      </div>

      <Panel
        title={tab === "subscriptions" ? `Subscriptions (${total || rows.length})` : `Transactions (${total || rows.length})`}
        action={<CreditCard className="h-4 w-4 text-gray-400" />}
      >
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-[#4338CA]" />
          </div>
        ) : rows.length === 0 ? (
          <p className="text-sm text-gray-500">No {tab} found.</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs uppercase text-gray-400">
                    <th className="pb-2 font-medium">User</th>
                    <th className="pb-2 font-medium">Email</th>
                    {tab === "subscriptions" ? (
                      <>
                        <th className="pb-2 font-medium">Plan</th>
                        <th className="pb-2 font-medium">Status</th>
                        <th className="pb-2 font-medium">Cycle</th>
                        <th className="pb-2 font-medium">Period end</th>
                        <th className="pb-2 font-medium">Actions</th>
                      </>
                    ) : (
                      <>
                        <th className="pb-2 font-medium">Amount</th>
                        <th className="pb-2 font-medium">Method</th>
                        <th className="pb-2 font-medium">Status</th>
                        <th className="pb-2 font-medium">Provider ref</th>
                        <th className="pb-2 font-medium">Created</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                    <tr key={row.id || `${row.userId}-${index}`} className="border-b last:border-0">
                      <td className="py-3 font-medium text-gray-800">{displayUser(row)}</td>
                      <td className="py-3 text-gray-500">{displayEmail(row)}</td>
                      {tab === "subscriptions" ? (
                        <>
                          <td className="py-3">
                            <Badge color={statusColor(row.planId)}>{row.planId || "—"}</Badge>
                          </td>
                          <td className="py-3">
                            <Badge color={statusColor(row.status)}>
                              {(row.status || "—").replace(/_/g, " ")}
                            </Badge>
                          </td>
                          <td className="py-3 capitalize text-gray-600">
                            {row.billingCycle || "—"}
                            {row.cancelAtPeriodEnd ? " · ending" : ""}
                          </td>
                          <td className="py-3 text-gray-500">
                            {row.currentPeriodEnd
                              ? new Date(row.currentPeriodEnd).toLocaleDateString()
                              : "—"}
                          </td>
                          <td className="py-3">
                            {row.userId && String(row.planId || "").toLowerCase() !== "starter" ? (
                              <button
                                type="button"
                                onClick={() => runRevoke(row.userId)}
                                className="rounded-md border border-red-200 px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-50"
                              >
                                Revoke
                              </button>
                            ) : (
                              <span className="text-xs text-gray-400">—</span>
                            )}
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="py-3 font-medium text-gray-800">
                            {formatMoney(row.amount, row.currency || "RWF")}
                          </td>
                          <td className="py-3 capitalize text-gray-600">
                            {row.method || row.paymentMethod || "—"}
                          </td>
                          <td className="py-3">
                            <Badge color={statusColor(row.status)}>
                              {(row.status || "—").replace(/_/g, " ")}
                            </Badge>
                          </td>
                          <td className="py-3 font-mono text-xs text-gray-500">
                            {row.providerRef || "—"}
                          </td>
                          <td className="py-3 text-gray-500">
                            {row.createdAt ? new Date(row.createdAt).toLocaleString() : "—"}
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <PaginationControls
              page={page}
              totalPages={totalPages}
              total={total}
              limit={PAGE_SIZE}
              onPageChange={(next) => load(next, tab)}
            />
          </>
        )}
      </Panel>
    </RoleLayout>
  );
};

export default AdminBilling;
