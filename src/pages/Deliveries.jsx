import { Truck } from "lucide-react";
import StatusBadge from "../components/StatusBadge.jsx";
import { deliveries } from "../data/mockData.js";

const summary = [
  { label: "Scheduled", value: "2" },
  { label: "In transit", value: "1" },
  { label: "Delivered this month", value: "8" },
  { label: "Delayed", value: "1" },
];

export default function Deliveries() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-leaf">Deliveries</h1>
      <p className="mt-1 text-sm text-muted">
        Next delivery: <span className="font-semibold text-ink">Sep 15, 2024</span> to GreenFarm Co
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summary.map((s) => (
          <div key={s.label} className="card p-4">
            <div className="flex items-start justify-between">
              <p className="text-xs font-semibold text-gray-700">{s.label}</p>
              <span className="rounded-md bg-mint-pale p-1.5">
                <Truck className="h-4 w-4 text-forest" />
              </span>
            </div>
            <p className="mt-2 text-lg font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="card mt-6 p-5">
        <h2 className="text-sm font-bold">All deliveries</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs text-muted">
                <th className="py-3 pr-4 font-medium">Delivery ID</th>
                <th className="py-3 pr-4 font-medium">Order</th>
                <th className="py-3 pr-4 font-medium">Buyer</th>
                <th className="py-3 pr-4 font-medium">Route</th>
                <th className="py-3 pr-4 font-medium">Driver</th>
                <th className="py-3 pr-4 font-medium">ETA</th>
                <th className="py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {deliveries.map((d) => (
                <tr key={d.id} className="border-b border-gray-50 last:border-0">
                  <td className="py-3.5 pr-4 font-semibold">{d.id}</td>
                  <td className="py-3.5 pr-4">#{d.orderId}</td>
                  <td className="py-3.5 pr-4">{d.buyer}</td>
                  <td className="py-3.5 pr-4">{d.route}</td>
                  <td className="py-3.5 pr-4">{d.driver}</td>
                  <td className="py-3.5 pr-4">{d.eta}</td>
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
