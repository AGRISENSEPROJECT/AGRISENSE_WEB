import StatusBadge from "../../components/StatusBadge.jsx";
import { regions } from "../../data/govData.js";

export default function Regions() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-leaf">Regions</h1>
      <p className="mt-1 text-sm text-muted">Production and food security by province</p>

      <div className="card mt-6 p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs text-muted">
                <th className="py-3 pr-4 font-medium">Province</th>
                <th className="py-3 pr-4 font-medium">Main crops</th>
                <th className="py-3 pr-4 font-medium">Production (season)</th>
                <th className="py-3 pr-4 font-medium">Registered farmers</th>
                <th className="py-3 pr-4 font-medium">Food security</th>
                <th className="py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {regions.map((r) => (
                <tr key={r.name} className="border-b border-gray-50 last:border-0">
                  <td className="py-3.5 pr-4 font-semibold">{r.name}</td>
                  <td className="py-3.5 pr-4">{r.mainCrops}</td>
                  <td className="py-3.5 pr-4">{r.production}</td>
                  <td className="py-3.5 pr-4">{r.farmers.toLocaleString()}</td>
                  <td className="py-3.5 pr-4">{r.foodSecurity} / 10</td>
                  <td className="py-3.5">
                    <StatusBadge status={r.status} />
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
