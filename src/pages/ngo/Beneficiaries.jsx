import StatusBadge from "../../components/StatusBadge.jsx";
import { beneficiaries } from "../../data/ngoData.js";

export default function Beneficiaries() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-leaf">Beneficiaries</h1>
      <p className="mt-1 text-sm text-muted">Cooperatives and farmer groups supported</p>

      <div className="card mt-6 p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs text-muted">
                <th className="py-3 pr-4 font-medium">Beneficiary</th>
                <th className="py-3 pr-4 font-medium">Type</th>
                <th className="py-3 pr-4 font-medium">Region</th>
                <th className="py-3 pr-4 font-medium">Program</th>
                <th className="py-3 pr-4 font-medium">Support received</th>
                <th className="py-3 pr-4 font-medium">Since</th>
                <th className="py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {beneficiaries.map((b) => (
                <tr key={b.name} className="border-b border-gray-50 last:border-0">
                  <td className="py-3.5 pr-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-mint-pale text-xs font-semibold text-forest">
                        {b.name
                          .split(" ")
                          .map((w) => w[0])
                          .slice(0, 2)
                          .join("")}
                      </span>
                      <span className="font-semibold">{b.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 pr-4 text-muted">{b.type}</td>
                  <td className="py-3.5 pr-4">{b.region}</td>
                  <td className="py-3.5 pr-4">{b.program}</td>
                  <td className="py-3.5 pr-4">{b.support}</td>
                  <td className="py-3.5 pr-4">{b.since}</td>
                  <td className="py-3.5">
                    <StatusBadge status={b.status} />
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
