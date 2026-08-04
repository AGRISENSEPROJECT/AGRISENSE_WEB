import { Boxes } from "lucide-react";
import StatusBadge from "../../components/StatusBadge.jsx";
import { distributions } from "../../data/ngoData.js";

const summary = [
  { label: "Scheduled", value: "2" },
  { label: "In transit", value: "1" },
  { label: "Delivered this month", value: "6" },
  { label: "Items distributed YTD", value: "18,400" },
];

export default function Distributions() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-leaf">Distributions</h1>
      <p className="mt-1 text-sm text-muted">Seed, tool, and equipment distributions to the field</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summary.map((s) => (
          <div key={s.label} className="card p-4">
            <div className="flex items-start justify-between">
              <p className="text-xs font-semibold text-gray-700">{s.label}</p>
              <span className="rounded-md bg-mint-pale p-1.5">
                <Boxes className="h-4 w-4 text-forest" />
              </span>
            </div>
            <p className="mt-2 text-lg font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="card mt-6 p-5">
        <h2 className="text-sm font-bold">All distributions</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs text-muted">
                <th className="py-3 pr-4 font-medium">ID</th>
                <th className="py-3 pr-4 font-medium">Program</th>
                <th className="py-3 pr-4 font-medium">Items</th>
                <th className="py-3 pr-4 font-medium">Quantity</th>
                <th className="py-3 pr-4 font-medium">Region</th>
                <th className="py-3 pr-4 font-medium">Date</th>
                <th className="py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {distributions.map((d) => (
                <tr key={d.id} className="border-b border-gray-50 last:border-0">
                  <td className="py-3.5 pr-4 font-semibold">{d.id}</td>
                  <td className="py-3.5 pr-4">{d.program}</td>
                  <td className="py-3.5 pr-4">{d.items}</td>
                  <td className="py-3.5 pr-4">{d.qty}</td>
                  <td className="py-3.5 pr-4">{d.region}</td>
                  <td className="py-3.5 pr-4">{d.date}</td>
                  <td className="py-3.5">
                    <StatusBadge status={d.status} />
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
