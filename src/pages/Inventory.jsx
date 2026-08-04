import { Sprout, Plus } from "lucide-react";
import StatusBadge from "../components/StatusBadge.jsx";
import { products } from "../data/mockData.js";

const kpiCards = [
  { label: "SKUs in stock", value: "6" },
  { label: "Low stock alerts", value: "2" },
  { label: "Reserved qty", value: "128 tons" },
  { label: "Warehouse capacity", value: "72%" },
];

export default function Inventory() {
  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-leaf">Inventory</h1>
          <p className="mt-1 text-sm text-muted">Stock levels across your warehouse</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-forest px-5 py-2.5 text-xs font-semibold text-white shadow hover:bg-forest-dark">
          <Plus className="h-4 w-4" /> Add product
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((s) => (
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
        <h2 className="text-sm font-bold">Products</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs text-muted">
                <th className="py-3 pr-4 font-medium">SKU</th>
                <th className="py-3 pr-4 font-medium">Product</th>
                <th className="py-3 pr-4 font-medium">Category</th>
                <th className="py-3 pr-4 font-medium">On hand</th>
                <th className="py-3 pr-4 font-medium">Reserved</th>
                <th className="py-3 pr-4 font-medium">Available</th>
                <th className="py-3 pr-4 font-medium">Reorder level</th>
                <th className="py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const available = p.onHand - p.reserved;
                const low = available <= p.reorderLevel;
                return (
                  <tr key={p.id} className="border-b border-gray-50 last:border-0">
                    <td className="py-3.5 pr-4 font-semibold">{p.id}</td>
                    <td className="py-3.5 pr-4">{p.name}</td>
                    <td className="py-3.5 pr-4">{p.category}</td>
                    <td className="py-3.5 pr-4">
                      {p.onHand} {p.unit}
                    </td>
                    <td className="py-3.5 pr-4">
                      {p.reserved} {p.unit}
                    </td>
                    <td className="py-3.5 pr-4 font-semibold">
                      {available} {p.unit}
                    </td>
                    <td className="py-3.5 pr-4">
                      {p.reorderLevel} {p.unit}
                    </td>
                    <td className="py-3.5">
                      <StatusBadge status={low ? "Low stock" : "In stock"} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
