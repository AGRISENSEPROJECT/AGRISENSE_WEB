import StatusBadge from "../../components/StatusBadge.jsx";
import { programs } from "../../data/ngoData.js";

export default function Programs() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-leaf">Programs</h1>
      <p className="mt-1 text-sm text-muted">Field programs and budget utilization</p>

      <div className="card mt-6 p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs text-muted">
                <th className="py-3 pr-4 font-medium">ID</th>
                <th className="py-3 pr-4 font-medium">Program</th>
                <th className="py-3 pr-4 font-medium">Focus</th>
                <th className="py-3 pr-4 font-medium">Region</th>
                <th className="py-3 pr-4 font-medium">Beneficiaries</th>
                <th className="py-3 pr-4 font-medium">Budget used</th>
                <th className="py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {programs.map((p) => (
                <tr key={p.id} className="border-b border-gray-50 last:border-0">
                  <td className="py-3.5 pr-4 font-semibold">{p.id}</td>
                  <td className="py-3.5 pr-4">{p.name}</td>
                  <td className="py-3.5 pr-4">{p.focus}</td>
                  <td className="py-3.5 pr-4">{p.region}</td>
                  <td className="py-3.5 pr-4">{p.beneficiaries.toLocaleString()}</td>
                  <td className="py-3.5 pr-4 font-semibold">{p.budgetUsed}</td>
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
