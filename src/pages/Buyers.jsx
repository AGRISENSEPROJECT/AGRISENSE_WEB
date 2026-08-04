import StatusBadge from "../components/StatusBadge.jsx";
import { buyers } from "../data/mockData.js";

export default function Buyers() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-leaf">Buyers</h1>
      <p className="mt-1 text-sm text-muted">Your buyer relationships and order history</p>

      <div className="card mt-6 p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs text-muted">
                <th className="py-3 pr-4 font-medium">Buyer</th>
                <th className="py-3 pr-4 font-medium">Contact</th>
                <th className="py-3 pr-4 font-medium">Location</th>
                <th className="py-3 pr-4 font-medium">Orders YTD</th>
                <th className="py-3 pr-4 font-medium">Volume</th>
                <th className="py-3 pr-4 font-medium">Last order</th>
                <th className="py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {buyers.map((b) => (
                <tr key={b.id} className="border-b border-gray-50 last:border-0">
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
                  <td className="py-3.5 pr-4 text-muted">{b.contact}</td>
                  <td className="py-3.5 pr-4">{b.location}</td>
                  <td className="py-3.5 pr-4">{b.ordersYtd}</td>
                  <td className="py-3.5 pr-4 font-semibold">{b.volume}</td>
                  <td className="py-3.5 pr-4">{b.lastOrder}</td>
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
