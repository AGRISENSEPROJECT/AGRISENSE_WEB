import { useEffect } from "react";
import { ShieldAlert, Check, Trash2 } from "lucide-react";
import RoleLayout from "../RoleLayout";
import { Panel } from "../ui";
import { ADMIN_ACCENT, adminLinks } from "./config";
import { adminModeration } from "./mock";

const AdminModeration = () => {
  useEffect(() => {
    document.title = "Moderation | Admin | AGRISENSE";
  }, []);

  return (
    <RoleLayout
      links={adminLinks}
      roleLabel="Admin Console"
      accent={ADMIN_ACCENT}
      title="Content Moderation"
      subtitle="Review reported community content and take action."
    >
      <Panel title={`Reported items (${adminModeration.length})`}>
        <ul className="space-y-3">
          {adminModeration.map((m) => (
            <li
              key={m.id}
              className="flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start gap-3">
                <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                <div>
                  <p className="text-sm font-semibold text-gray-800">{m.reason}</p>
                  <p className="mt-0.5 text-sm text-gray-600">"{m.excerpt}"</p>
                  <p className="mt-1 text-xs text-gray-400">
                    {m.author} · reported {m.reportedAt}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <button className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100">
                  <Check className="h-3.5 w-3.5" /> Approve
                </button>
                <button className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100">
                  <Trash2 className="h-3.5 w-3.5" /> Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      </Panel>
    </RoleLayout>
  );
};

export default AdminModeration;
