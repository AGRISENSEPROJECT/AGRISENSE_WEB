import { HandCoins } from "lucide-react";
import StatusBadge from "../../components/StatusBadge.jsx";
import { subsidyPrograms } from "../../data/govData.js";

const summary = [
  { label: "Active programs", value: "3" },
  { label: "Total budget", value: "17.9B RWF" },
  { label: "Disbursed", value: "14.6B RWF" },
  { label: "Beneficiaries reached", value: "38,400" },
];

export default function Subsidies() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-leaf">Subsidies</h1>
      <p className="mt-1 text-sm text-muted">Government support programs and disbursement</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summary.map((s) => (
          <div key={s.label} className="card p-4">
            <div className="flex items-start justify-between">
              <p className="text-xs font-semibold text-gray-700">{s.label}</p>
              <span className="rounded-md bg-mint-pale p-1.5">
                <HandCoins className="h-4 w-4 text-forest" />
              </span>
            </div>
            <p className="mt-2 text-lg font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="card mt-6 p-5">
        <h2 className="text-sm font-bold">All programs</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs text-muted">
                <th className="py-3 pr-4 font-medium">ID</th>
                <th className="py-3 pr-4 font-medium">Program</th>
                <th className="py-3 pr-4 font-medium">Crop</th>
                <th className="py-3 pr-4 font-medium">Budget</th>
                <th className="py-3 pr-4 font-medium">Disbursed</th>
                <th className="py-3 pr-4 font-medium">Beneficiaries</th>
                <th className="py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {subsidyPrograms.map((p) => (
                <tr key={p.id} className="border-b border-gray-50 last:border-0">
                  <td className="py-3.5 pr-4 font-semibold">{p.id}</td>
                  <td className="py-3.5 pr-4">{p.name}</td>
                  <td className="py-3.5 pr-4">{p.crop}</td>
                  <td className="py-3.5 pr-4">{p.budget}</td>
                  <td className="py-3.5 pr-4 font-semibold">{p.disbursed}</td>
                  <td className="py-3.5 pr-4">{p.beneficiaries.toLocaleString()}</td>
                  <td className="py-3.5">
                    <StatusBadge status={p.status} />
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
