import StatusBadge from "../../components/StatusBadge.jsx";
import { registry } from "../../data/govData.js";

export default function Registry() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-leaf">Registry</h1>
      <p className="mt-1 text-sm text-muted">Registered suppliers, buyers, and processors</p>

      <div className="card mt-6 p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs text-muted">
                <th className="py-3 pr-4 font-medium">Organization</th>
                <th className="py-3 pr-4 font-medium">Type</th>
                <th className="py-3 pr-4 font-medium">Region</th>
                <th className="py-3 pr-4 font-medium">License</th>
                <th className="py-3 pr-4 font-medium">Registered since</th>
                <th className="py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {registry.map((r) => (
                <tr key={r.license} className="border-b border-gray-50 last:border-0">
                  <td className="py-3.5 pr-4 font-semibold">{r.name}</td>
                  <td className="py-3.5 pr-4">{r.type}</td>
                  <td className="py-3.5 pr-4">{r.region}</td>
                  <td className="py-3.5 pr-4">{r.license}</td>
                  <td className="py-3.5 pr-4">{r.since}</td>
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
