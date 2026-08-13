import { useEffect, useState } from "react";
import { Download, Loader2 } from "lucide-react";
import RoleLayout from "../RoleLayout";
import { Panel } from "../ui";
import { NGO_ACCENT, ngoLinks } from "./config";
import { useOrgPortal } from "./useOrgPortal";
import { ApiError } from "@/api";

const NgoReports = () => {
  const portal = useOrgPortal();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    document.title = `Reports | ${portal.label} | AGRISENSE`;
  }, [portal.label]);

  const exportReport = async () => {
    setLoading(true);
    setError(null);
    setPreview(null);
    try {
      const res = await portal.exportReport();
      if (res instanceof Blob) {
        const url = URL.createObjectURL(res);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${portal.label.toLowerCase()}-report.json`;
        a.click();
        URL.revokeObjectURL(url);
        setPreview("Report downloaded.");
      } else {
        setPreview(JSON.stringify(res, null, 2));
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to export report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <RoleLayout
      links={ngoLinks}
      roleLabel={portal.roleLabel}
      accent={NGO_ACCENT}
      title="Monitoring & Evaluation Reports"
      subtitle="Export regional impact reports for planning and accountability."
      actions={
        <button
          type="button"
          onClick={exportReport}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          style={{ backgroundColor: NGO_ACCENT }}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          Export report
        </button>
      }
    >
      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <Panel title="Impact export">
        <p className="text-sm text-gray-600">
          Pull the latest {portal.label.toLowerCase()} report from AgriSense for budget allocation,
          disease-control planning, and food-security monitoring.
        </p>
        {preview && (
          <pre className="mt-4 max-h-96 overflow-auto rounded-xl bg-gray-900 p-4 text-xs text-green-100">
            {preview}
          </pre>
        )}
      </Panel>
    </RoleLayout>
  );
};

export default NgoReports;
