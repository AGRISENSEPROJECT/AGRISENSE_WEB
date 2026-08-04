import { Wallet } from "lucide-react";
import StatusBadge from "../../components/StatusBadge.jsx";
import { funding } from "../../data/ngoData.js";

const summary = [
  { label: "Total committed", value: "$4.03M" },
  { label: "Received to date", value: "$2.79M" },
  { label: "Utilized", value: "74%" },
  { label: "Active donors", value: "4" },
];

export default function Funding() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-leaf">Funding</h1>
      <p className="mt-1 text-sm text-muted">Donor commitments and fund utilization</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summary.map((s) => (
          <div key={s.label} className="card p-4">
            <div className="flex items-start justify-between">
              <p className="text-xs font-semibold text-gray-700">{s.label}</p>
              <span className="rounded-md bg-mint-pale p-1.5">
                <Wallet className="h-4 w-4 text-forest" />
              </span>
            </div>
            <p className="mt-2 text-lg font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="card mt-6 p-5">
        <h2 className="text-sm font-bold">Funding sources</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs text-muted">
                <th className="py-3 pr-4 font-medium">Donor</th>
                <th className="py-3 pr-4 font-medium">Type</th>
                <th className="py-3 pr-4 font-medium">Committed</th>
                <th className="py-3 pr-4 font-medium">Received</th>
                <th className="py-3 pr-4 font-medium">Period</th>
                <th className="py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {funding.map((f) => (
                <tr key={f.donor} className="border-b border-gray-50 last:border-0">
                  <td className="py-3.5 pr-4 font-semibold">{f.donor}</td>
                  <td className="py-3.5 pr-4">{f.type}</td>
                  <td className="py-3.5 pr-4">{f.committed}</td>
                  <td className="py-3.5 pr-4 font-semibold">{f.received}</td>
                  <td className="py-3.5 pr-4">{f.period}</td>
                  <td className="py-3.5">
                    <StatusBadge status={f.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
