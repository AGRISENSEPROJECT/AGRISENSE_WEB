import { FileText, Download } from "lucide-react";
import { reports } from "../../data/govData.js";

export default function Reports() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-leaf">Reports</h1>
      <p className="mt-1 text-sm text-muted">Published assessments and program reports</p>

      <div className="mt-6 flex flex-col gap-4">
        {reports.map((r) => (
          <div key={r.title} className="card flex items-center gap-4 p-5">
            <span className="rounded-xl bg-mint-pale p-3">
              <FileText className="h-6 w-6 text-forest" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-bold">{r.title}</h2>
              <p className="mt-0.5 text-xs text-muted">{r.desc}</p>
              <p className="mt-1 text-[11px] text-gray-400">Published {r.date}</p>
            </div>
            <button className="flex shrink-0 items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-xs font-semibold text-forest hover:bg-mint-pale">
              <Download className="h-3.5 w-3.5" /> Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
