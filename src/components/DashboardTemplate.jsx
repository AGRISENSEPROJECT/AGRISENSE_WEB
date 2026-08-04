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
  ResponsiveContainer,
} from "recharts";
import StatCard from "./StatCard.jsx";

const PIE_COLORS = ["#4e7a5a", "#86ae91", "#c4d8ca", "#e8f1ea", "#d1d5db"];

const axisProps = {
  tick: { fontSize: 10, fill: "#9ca3af" },
  axisLine: false,
  tickLine: false,
};

function YearSelect() {
  return (
    <button className="flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1.5 text-xs text-gray-500">
      Year <ChevronDown className="h-3 w-3" />
    </button>
  );
}

/**
 * Same layout as the supplier dashboard, parameterized per role:
 * greeting + KPI grid on the left, weather chip + CTA + pie on the right,
 * a wide line chart bottom-left and an activity chart bottom-right.
 */
export default function DashboardTemplate({ subtitle, chipText, ctaText, kpis, pie, line, activity }) {
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
      <div className="xl:col-span-2">
        <h1 className="text-2xl font-bold text-leaf">Good Morning !</h1>
        <p className="mt-1 text-sm text-muted">{subtitle}</p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {kpis.map((kpi) => (
            <StatCard key={kpi.label} {...kpi} />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <div className="card flex items-center gap-2 px-4 py-2.5 text-xs font-medium">
            <Sun className="h-4 w-4 text-amber-400" />
            {chipText}
          </div>
          <button className="rounded-lg bg-forest px-5 py-2.5 text-xs font-semibold text-white shadow hover:bg-forest-dark">
            {ctaText}
          </button>
        </div>

        <div className="card flex-1 p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold">{pie.title}</h2>
            <YearSelect />
          </div>
          <div className="mt-2 flex items-center">
            <ResponsiveContainer width="60%" height={210}>
              <PieChart>
                <Pie
                  data={pie.data}
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
                  {pie.data.map((entry, i) => (
                    <Cell key={entry.name} fill={PIE_COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
            <ul className="flex flex-col gap-2 text-xs text-gray-600">
              {pie.data.map((entry, i) => (
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

      <div className="card p-5 xl:col-span-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold">{line.title}</h2>
          <YearSelect />
        </div>
        <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
          {line.series.map((s) => (
            <span key={s.key} className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
              {s.label}
            </span>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={line.data} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef1f2" />
            <XAxis dataKey="month" {...axisProps} />
            <YAxis {...axisProps} />
            <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
            {line.series.map((s) => (
              <Line
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.label}
                stroke={s.color}
                strokeWidth={2.5}
                dot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="card p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold">{activity.title}</h2>
          <div className="flex items-center gap-3 text-[10px] text-gray-500">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-sm bg-leaf" /> {activity.areaLabel}
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-sm bg-gray-800" /> {activity.lineLabel}
            </span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={activity.data} margin={{ top: 20, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef1f2" />
            <XAxis dataKey="month" {...axisProps} />
            <YAxis {...axisProps} />
            <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
            <Area
              type="monotone"
              dataKey={activity.areaKey}
              name={activity.areaLabel}
              stroke="#4c9a6b"
              strokeDasharray="5 4"
              strokeWidth={2}
              fill="#c4d8ca"
              fillOpacity={0.45}
            />
            <Line
              type="monotone"
              dataKey={activity.lineKey}
              name={activity.lineLabel}
              stroke="#1f2937"
              strokeWidth={2}
              dot={{ r: 3, fill: "#fff", stroke: "#1f2937", strokeWidth: 1.5 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
