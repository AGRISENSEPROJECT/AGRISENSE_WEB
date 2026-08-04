import { Sprout } from "lucide-react";

export default function StatCard({ label, value, trend }) {
  return (
    <div className="card p-4">
      <div className="flex items-start justify-between">
        <p className="text-xs font-semibold text-gray-700">{label}</p>
        <span className="rounded-md bg-mint-pale p-1.5">
          <Sprout className="h-4 w-4 text-forest" />
        </span>
      </div>
      <p className="mt-2 text-lg font-bold">{value}</p>
      <p className="mt-1 text-xs text-muted">
        <span className="font-semibold text-leaf">{trend.split(" ")[0]}</span>{" "}
        {trend.split(" ").slice(1).join(" ")}
      </p>
    </div>
  );
}
