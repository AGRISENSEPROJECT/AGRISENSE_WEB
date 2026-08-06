import { useEffect, useState } from "react";
import { ShieldAlert, Check, Trash2, Loader2 } from "lucide-react";
import RoleLayout from "../RoleLayout";
import { Panel } from "../ui";
import { ADMIN_ACCENT, adminLinks } from "./config";
import { adminService, ApiError, type AdminReportItem } from "@/api";

function getReports(data: unknown): AdminReportItem[] {
  if (!data || typeof data !== "object") return [];
  const record = data as Record<string, unknown>;
  const items = record.reports ?? record.items ?? record.data;
  return Array.isArray(items) ? (items as AdminReportItem[]) : [];
}

const AdminModeration = () => {
  const [reports, setReports] = useState<AdminReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Moderation | Admin | AGRISENSE";
  }, []);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminService.getReports(1, 50);
      setReports(getReports(res));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load reports.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

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
      <Panel title={`Reported items (${reports.length})`}>
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-[#4338CA]" />
          </div>
        ) : (
        <ul className="space-y-3">
          {reports.map((m) => (
            <li
              key={m.id}
              className="flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start gap-3">
                <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                <div>
                  <p className="text-sm font-semibold text-gray-800">{m.reason}</p>
                  <p className="mt-0.5 text-sm text-gray-600">"{m.excerpt || m.description || "No description"}"</p>
                  <p className="mt-1 text-xs text-gray-400">
                    {(m.author?.firstName || m.author?.username || "Unknown user")} · reported{" "}
                    {m.createdAt ? new Date(m.createdAt).toLocaleString() : "recently"}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  onClick={async () => {
                    if (!m.postId) return;
                    await adminService.moderateReportedPost(m.postId);
                    await load();
                  }}
                  className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
                >
                  <Check className="h-3.5 w-3.5" /> Approve
                </button>
                <button
                  onClick={async () => {
                    if (!m.postId) return;
                    await adminService.moderateReportedPost(m.postId);
                    await load();
                  }}
                  className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
        )}
      </Panel>
    </RoleLayout>
  );
};

export default AdminModeration;
