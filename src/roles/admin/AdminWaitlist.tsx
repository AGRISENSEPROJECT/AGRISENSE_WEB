import { useEffect, useState } from "react";
import { Loader2, Mail, Ban } from "lucide-react";
import RoleLayout from "../RoleLayout";
import { Panel, Badge, PaginationControls, getPaginationMeta } from "../ui";
import { ADMIN_ACCENT, adminLinks } from "./config";
import { ApiError, waitlistService, type WaitlistEntry, type WaitlistStats } from "@/api";

const PAGE_SIZE = 20;

function getEntries(data: unknown): WaitlistEntry[] {
  if (!data || typeof data !== "object") return [];
  const record = data as Record<string, unknown>;
  const items = record.entries ?? record.waitlist ?? record.items ?? record.data;
  return Array.isArray(items) ? (items as WaitlistEntry[]) : [];
}

const AdminWaitlist = () => {
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [stats, setStats] = useState<WaitlistStats | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const load = async (nextPage = page) => {
    setLoading(true);
    setError(null);
    try {
      const [listRes, statsRes] = await Promise.all([
        waitlistService.list({ page: nextPage, limit: PAGE_SIZE }),
        waitlistService.stats().catch(() => null),
      ]);
      const rows = getEntries(listRes);
      const meta = getPaginationMeta(listRes, nextPage, PAGE_SIZE, rows.length);
      setEntries(rows);
      setPage(meta.page);
      setTotalPages(meta.totalPages);
      setTotal(meta.total);
      setStats(statsRes);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load waitlist.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Waitlist | Admin | AGRISENSE";
    load(1);
  }, []);

  const run = async (task: () => Promise<unknown>, ok: string) => {
    setInfo(null);
    try {
      await task();
      setInfo(ok);
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
      title="Waitlist"
      subtitle="Manage early-access signups and promotional emails."
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

      {stats && (
        <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Total", value: stats.total },
            { label: "Active", value: stats.active },
            { label: "Inactive", value: stats.inactive },
            { label: "Emails sent", value: stats.emailsSent },
          ].map((card) => (
            <Panel key={card.label}>
              <p className="text-xs uppercase tracking-wide text-gray-400">{card.label}</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{card.value ?? "—"}</p>
            </Panel>
          ))}
        </div>
      )}

      <Panel title={`Signups (${total || entries.length})`}>
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-[#4338CA]" />
          </div>
        ) : entries.length === 0 ? (
          <p className="text-sm text-gray-500">No waitlist entries yet.</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs uppercase text-gray-400">
                    <th className="pb-2 font-medium">Name</th>
                    <th className="pb-2 font-medium">Email</th>
                    <th className="pb-2 font-medium">Status</th>
                    <th className="pb-2 font-medium">Joined</th>
                    <th className="pb-2 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry) => {
                    const inactive =
                      entry.isActive === false ||
                      Boolean(entry.deactivatedAt) ||
                      String(entry.status || "").toUpperCase() === "INACTIVE";
                    return (
                      <tr key={entry.id} className="border-b last:border-0">
                        <td className="py-3 font-medium text-gray-800">
                          {entry.fullName || "—"}
                        </td>
                        <td className="py-3 text-gray-600">{entry.email}</td>
                        <td className="py-3">
                          <Badge color={inactive ? "gray" : "green"}>
                            {inactive ? "Inactive" : "Active"}
                          </Badge>
                        </td>
                        <td className="py-3 text-gray-500">
                          {entry.createdAt ? new Date(entry.createdAt).toLocaleString() : "—"}
                        </td>
                        <td className="py-3">
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() =>
                                run(
                                  () => waitlistService.resendEmail(entry.id),
                                  "Welcome email resent.",
                                )
                              }
                              className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-semibold"
                            >
                              <Mail className="h-3.5 w-3.5" />
                              Resend email
                            </button>
                            {!inactive && (
                              <button
                                onClick={() =>
                                  run(
                                    () => waitlistService.deactivate(entry.id),
                                    "Entry deactivated.",
                                  )
                                }
                                className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-2 py-1 text-xs font-semibold text-red-600"
                              >
                                <Ban className="h-3.5 w-3.5" />
                                Deactivate
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
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
          </>
        )}
      </Panel>
    </RoleLayout>
  );
};

export default AdminWaitlist;
