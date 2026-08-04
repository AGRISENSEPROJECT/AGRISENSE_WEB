import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { revenueByMonth, fulfillmentTrend, buyerConcentration, supplyMix } from "../data/mockData.js";

const PIE_COLORS = ["#4e7a5a", "#86ae91", "#c4d8ca", "#e8f1ea", "#d1d5db"];

function ChartCard({ title, children }) {
  return (
    <div className="card p-5">
      <h2 className="text-sm font-bold">{title}</h2>
      <div className="mt-3">{children}</div>
    </div>
  );
}

const axisProps = {
  tick: { fontSize: 10, fill: "#9ca3af" },
  axisLine: false,
  tickLine: false,
};

export default function Analytics() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-leaf">Analytics</h1>
      <p className="mt-1 text-sm text-muted">Performance across sales, fulfillment, and buyers</p>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard title="Revenue by month ($k)">
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={revenueByMonth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef1f2" />
              <XAxis dataKey="month" {...axisProps} />
              <YAxis {...axisProps} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} formatter={(v) => `$${v}k`} />
              <Line type="monotone" dataKey="revenue" stroke="#4c9a6b" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Fulfillment rate trend (%)">
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={fulfillmentTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef1f2" />
              <XAxis dataKey="month" {...axisProps} />
              <YAxis domain={[70, 95]} {...axisProps} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} formatter={(v) => `${v}%`} />
              <Line type="monotone" dataKey="rate" stroke="#1f2937" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top products (share of volume)">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={supplyMix} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef1f2" />
              <XAxis dataKey="name" {...axisProps} />
              <YAxis {...axisProps} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} formatter={(v) => `${v}%`} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {supplyMix.map((entry, i) => (
                  <Cell key={entry.name} fill={PIE_COLORS[i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Buyer concentration">
          <div className="flex items-center">
            <ResponsiveContainer width="55%" height={240}>
              <PieChart>
                <Pie
                  data={buyerConcentration}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={95}
                  paddingAngle={2}
                >
                  {buyerConcentration.map((entry, i) => (
                    <Cell key={entry.name} fill={PIE_COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} formatter={(v) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
            <ul className="flex flex-col gap-2 text-xs text-gray-600">
              {buyerConcentration.map((entry, i) => (
                <li key={entry.name} className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: PIE_COLORS[i] }}
                  />
                  {entry.name} — {entry.value}%
                </li>
              ))}
            </ul>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
