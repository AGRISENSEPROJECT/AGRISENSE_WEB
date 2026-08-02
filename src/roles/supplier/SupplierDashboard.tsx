import { useEffect } from "react";
import {
  Package,
  ShoppingCart,
  DollarSign,
  Users,
  Plus,
  AlertTriangle,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import RoleLayout from "../RoleLayout";
import { StatCard, Panel, Badge } from "../ui";
import { SUPPLIER_ACCENT, supplierLinks } from "./config";
import {
  supplierOrders,
  supplierSales,
  supplierTopProducts,
  supplierProducts,
} from "./mock";

const statusColor: Record<string, "green" | "amber" | "red" | "blue" | "gray"> = {
  pending: "amber",
  processing: "blue",
  shipped: "blue",
  delivered: "green",
  cancelled: "red",
};

const SupplierDashboard = () => {
  useEffect(() => {
    document.title = "Supplier Dashboard | AGRISENSE";
  }, []);

  const lowStock = supplierProducts.filter((p) => p.status !== "in_stock");

  return (
    <RoleLayout
      links={supplierLinks}
      roleLabel="Supplier Portal"
      accent={SUPPLIER_ACCENT}
      title="Supplier Overview"
      subtitle="Track your products, orders and revenue at a glance."
      actions={
        <button
          className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white"
          style={{ backgroundColor: SUPPLIER_ACCENT }}
        >
          <Plus className="h-4 w-4" /> Add Product
        </button>
      }
    >
      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Package} label="Total Products" value={supplierProducts.length} delta="+3 this month" accent={SUPPLIER_ACCENT} />
        <StatCard icon={ShoppingCart} label="Orders (30d)" value={83} delta="+18.6%" accent={SUPPLIER_ACCENT} />
        <StatCard icon={DollarSign} label="Revenue (30d)" value="$8,100" delta="+12.5%" accent={SUPPLIER_ACCENT} />
        <StatCard icon={Users} label="Active Buyers" value={57} delta="+5" accent={SUPPLIER_ACCENT} />
      </div>

      {/* Charts */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Panel title="Revenue & Orders" className="lg:col-span-2">
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={supplierSales} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="supRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={SUPPLIER_ACCENT} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={SUPPLIER_ACCENT} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke={SUPPLIER_ACCENT} strokeWidth={2} fill="url(#supRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Sales by Category">
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={supplierTopProducts} cx="50%" cy="45%" innerRadius={55} outerRadius={85} paddingAngle={2} dataKey="value">
                  {supplierTopProducts.map((e) => (
                    <Cell key={e.name} fill={e.color} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      {/* Recent orders + low stock */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Panel title="Recent Orders" className="lg:col-span-2">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs uppercase text-gray-400">
                  <th className="pb-2 font-medium">Order</th>
                  <th className="pb-2 font-medium">Buyer</th>
                  <th className="pb-2 font-medium">Product</th>
                  <th className="pb-2 font-medium">Total</th>
                  <th className="pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {supplierOrders.map((o) => (
                  <tr key={o.id} className="border-b last:border-0">
                    <td className="py-3 font-medium text-gray-800">{o.id}</td>
                    <td className="py-3 text-gray-600">{o.buyer}</td>
                    <td className="py-3 text-gray-600">{o.product}</td>
                    <td className="py-3 font-semibold text-gray-800">${o.total}</td>
                    <td className="py-3">
                      <Badge color={statusColor[o.status]}>{o.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title="Inventory Alerts">
          <ul className="space-y-3">
            {lowStock.map((p) => (
              <li key={p.id} className="flex items-start gap-3 rounded-lg bg-amber-50 p-3">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                <div>
                  <p className="text-sm font-medium text-gray-800">{p.name}</p>
                  <p className="text-xs text-gray-500">
                    {p.status === "out_of_stock"
                      ? "Out of stock"
                      : `Only ${p.stock} ${p.unit} left`}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </RoleLayout>
  );
};

export default SupplierDashboard;
