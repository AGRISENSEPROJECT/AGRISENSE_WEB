import { useEffect, useState } from "react";
import { ShieldAlert, EyeOff, Eye, Trash2, Loader2 } from "lucide-react";
import RoleLayout from "../RoleLayout";
import { Panel, PaginationControls, getPaginationMeta } from "../ui";
import { ADMIN_ACCENT, adminLinks } from "./config";
import { adminService, ApiError, type AdminReportItem } from "@/api";
import { getUserDisplayName } from "@/lib/user";

const PAGE_SIZE = 20;

function getReports(data: unknown): AdminReportItem[] {
  if (!data || typeof data !== "object") return [];
  const record = data as Record<string, unknown>;
  const items = record.posts ?? record.reports ?? record.items ?? record.data;
  return Array.isArray(items) ? (items as AdminReportItem[]) : [];
}

function resolvePostId(item: AdminReportItem): string | null {
  if (item.postId) return String(item.postId);
  if (item.id) return String(item.id);
  return null;
}

const AdminModeration = () => {
  const [reports, setReports] = useState<AdminReportItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Moderation | Admin | AGRISENSE";
  }, []);

  const load = async (nextPage = page) => {
    setLoading(true);
    setError(null);
    try {
      let res: unknown;
      try {
        res = await adminService.getReportedPosts(nextPage, PAGE_SIZE);
      } catch {
        res = await adminService.getReports(nextPage, PAGE_SIZE);
      }
      const rows = getReports(res);
      const meta = getPaginationMeta(res, nextPage, PAGE_SIZE, rows.length);
      setReports(rows);
      setPage(meta.page);
      setTotalPages(meta.totalPages);
      setTotal(meta.total);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load reports.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(1);
  }, []);

  const moderate = async (item: AdminReportItem, action: "hide" | "unhide" | "delete") => {
    const postId = resolvePostId(item);
    if (!postId) {
      setError("Missing post id for this report.");
      return;
    }
    try {
      await adminService.moderatePost(postId, { action });
      await load(page);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Moderation action failed.");
    }
  };

  return (
    <RoleLayout
      links={adminLinks}
      roleLabel="Admin Console"
      accent={ADMIN_ACCENT}
      title="Content Moderation"
      subtitle="Review reported community content and take action."
    >
      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <Panel title={`Reported items (${total || reports.length})`}>
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-[#4338CA]" />
          </div>
        ) : reports.length === 0 ? (
          <p className="text-sm text-gray-500">No reported posts right now.</p>
        ) : (
          <>
            <ul className="space-y-3">
              {reports.map((m) => (
                <li
                  key={m.id}
                  className="flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start gap-3">
                    <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        {m.reason || "Reported post"}
                      </p>
                      <p className="mt-0.5 text-sm text-gray-600">
                        &quot;{m.excerpt || m.description || "No description"}&quot;
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        {getUserDisplayName(m.author) || "Unknown user"} · reported{" "}
                        {m.createdAt ? new Date(m.createdAt).toLocaleString() : "recently"}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2">
                    <button
                      onClick={() => moderate(m, "hide")}
                      className="inline-flex items-center gap-1 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800 hover:bg-amber-100"
                    >
                      <EyeOff className="h-3.5 w-3.5" /> Hide
                    </button>
                    <button
                      onClick={() => moderate(m, "unhide")}
                      className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
                    >
                      <Eye className="h-3.5 w-3.5" /> Unhide
                    </button>
                    <button
                      onClick={() => moderate(m, "delete")}
                      className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
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

export default AdminModeration;
