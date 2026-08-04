const styles = {
  Pending: "bg-amber-50 text-amber-700",
  Confirmed: "bg-mint-pale text-forest",
  Packed: "bg-blue-50 text-blue-700",
  Shipped: "bg-indigo-50 text-indigo-700",
  Delivered: "bg-green-50 text-green-700",
  Cancelled: "bg-red-50 text-red-600",
  Scheduled: "bg-mint-pale text-forest",
  "In transit": "bg-blue-50 text-blue-700",
  Delayed: "bg-red-50 text-red-600",
  Active: "bg-green-50 text-green-700",
  Inactive: "bg-gray-100 text-gray-500",
  "Low stock": "bg-red-50 text-red-600",
  "In stock": "bg-green-50 text-green-700",
  "On track": "bg-green-50 text-green-700",
  "At risk": "bg-amber-50 text-amber-700",
  Critical: "bg-red-50 text-red-600",
  Licensed: "bg-green-50 text-green-700",
  "Pending review": "bg-amber-50 text-amber-700",
  Suspended: "bg-red-50 text-red-600",
  Closed: "bg-gray-100 text-gray-500",
  Completed: "bg-green-50 text-green-700",
  Received: "bg-green-50 text-green-700",
  Committed: "bg-mint-pale text-forest",
};

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
        styles[status] ?? "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}
