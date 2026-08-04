import { useState } from "react";
import { Sprout } from "lucide-react";
import StatusBadge from "../components/StatusBadge.jsx";
import { orders } from "../data/mockData.js";

const miniStats = [
  { label: "Open orders", value: "4" },
  { label: "Awaiting payment", value: "2" },
  { label: "Ready to ship", value: "1" },
  { label: "Completed this month", value: "12" },
];

const statuses = ["All", "Pending", "Confirmed", "Packed", "Shipped", "Delivered", "Cancelled"];

export default function Orders() {
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered =
    statusFilter === "All" ? orders : orders.filter((o) => o.status === statusFilter);

  return (
    <div>
      <h1 className="text-2xl font-bold text-leaf">Orders</h1>
      <p className="mt-1 text-sm text-muted">Track and manage buyer orders</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {miniStats.map((s) => (
          <div key={s.label} className="card p-4">
            <div className="flex items-start justify-between">
              <p className="text-xs font-semibold text-gray-700">{s.label}</p>
              <span className="rounded-md bg-mint-pale p-1.5">
                <Sprout className="h-4 w-4 text-forest" />
              </span>
            </div>
            <p className="mt-2 text-lg font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="card mt-6 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-bold">All orders</h2>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-full border border-gray-200 px-3 py-1.5 text-xs text-gray-600 outline-none"
          >
            {statuses.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs text-muted">
                <th className="py-3 pr-4 font-medium">Order ID</th>
                <th className="py-3 pr-4 font-medium">Buyer</th>
                <th className="py-3 pr-4 font-medium">Product</th>
                <th className="py-3 pr-4 font-medium">Qty</th>
                <th className="py-3 pr-4 font-medium">Unit price</th>
                <th className="py-3 pr-4 font-medium">Total</th>
                <th className="py-3 pr-4 font-medium">Status</th>
                <th className="py-3 font-medium">Delivery date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id} className="border-b border-gray-50 last:border-0">
                  <td className="py-3.5 pr-4 font-semibold">#{o.id}</td>
                  <td className="py-3.5 pr-4">{o.buyer}</td>
                  <td className="py-3.5 pr-4">{o.product}</td>
                  <td className="py-3.5 pr-4">{o.qty}</td>
                  <td className="py-3.5 pr-4">${o.unitPrice}/t</td>
                  <td className="py-3.5 pr-4 font-semibold">${o.total.toLocaleString()}</td>
                  <td className="py-3.5 pr-4">
                    <StatusBadge status={o.status} />
                  </td>
                  <td className="py-3.5">{o.deliveryDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
