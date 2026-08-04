import { Sun, ChevronDown } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ComposedChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import StatCard from "../components/StatCard.jsx";
import { kpis, supplyMix, supplyVolume, orderActivity } from "../data/mockData.js";

const PIE_COLORS = ["#4e7a5a", "#86ae91", "#c4d8ca"];

function YearSelect() {
  return (
    <button className="flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1.5 text-xs text-gray-500">
      Year <ChevronDown className="h-3 w-3" />
    </button>
  );
}

export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
      {/* Left column: greeting + KPI cards */}
      <div className="xl:col-span-2">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-leaf">Good Morning !</h1>
            <p className="mt-1 text-sm text-muted">
              Welcome back to your supplier dashboard
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {kpis.map((kpi) => (
            <StatCard key={kpi.label} {...kpi} />
          ))}
        </div>
      </div>

      {/* Right column: weather chip + CTA + pie */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <div className="card flex items-center gap-2 px-4 py-2.5 text-xs font-medium">
            <Sun className="h-4 w-4 text-amber-400" />
            34°C – Sunny with clear skies
          </div>
          <button className="rounded-lg bg-forest px-5 py-2.5 text-xs font-semibold text-white shadow hover:bg-forest-dark">
            Explore more
          </button>
        </div>

        <div className="card flex-1 p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold">Product Supply Mix</h2>
            <YearSelect />
          </div>
          <div className="mt-2 flex items-center">
            <ResponsiveContainer width="60%" height={210}>
              <PieChart>
                <Pie
                  data={supplyMix}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  labelLine={false}
                  label={({ value, x, y }) => (
                    <text x={x} y={y} fill="#fff" fontSize={11} textAnchor="middle">
                      {value}%
                    </text>
                  )}
                >
                  {supplyMix.map((entry, i) => (
                    <Cell key={entry.name} fill={PIE_COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
            <ul className="flex flex-col gap-2 text-xs text-gray-600">
              {supplyMix.map((entry, i) => (
                <li key={entry.name} className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: PIE_COLORS[i] }}
                  />
                  {entry.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom left: supply volume line chart */}
      <div className="card p-5 xl:col-span-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold">Supply Volume Monitoring</h2>
          <YearSelect />
        </div>
        <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-leaf" /> Maize
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-gray-800" /> Rice
          </span>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={supplyVolume} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef1f2" />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ borderRadius: 8, fontSize: 12 }}
              formatter={(v, name) => [`${v} t`, name === "maize" ? "Maize" : "Rice"]}
            />
            <Line type="monotone" dataKey="maize" stroke="#4c9a6b" strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey="rice" stroke="#1f2937" strokeWidth={2.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom right: order activity */}
      <div className="card p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold">Order Activity</h2>
          <div className="flex items-center gap-3 text-[10px] text-gray-500">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-sm bg-leaf" /> Incoming
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-sm bg-gray-800" /> Fulfilled
            </span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={orderActivity} margin={{ top: 20, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef1f2" />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
            <Area
              type="monotone"
              dataKey="incoming"
              stroke="#4c9a6b"
              strokeDasharray="5 4"
              strokeWidth={2}
              fill="#c4d8ca"
              fillOpacity={0.45}
              name="Incoming orders"
            />
            <Line
              type="monotone"
              dataKey="fulfilled"
              stroke="#1f2937"
              strokeWidth={2}
              dot={{ r: 3, fill: "#fff", stroke: "#1f2937", strokeWidth: 1.5 }}
              name="Fulfilled orders"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
