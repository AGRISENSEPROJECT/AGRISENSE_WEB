import { useEffect } from "react";
import { Users, MapPinned, HeartHandshake, Wallet, AlertTriangle } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import RoleLayout from "../RoleLayout";
import { StatCard, Panel, Badge } from "../ui";
import { NGO_ACCENT, ngoLinks } from "./config";
import { ngoPrograms, ngoRegions, ngoAdoption, ngoAlerts } from "./mock";

const alertStyle: Record<string, { color: "red" | "amber" | "blue"; bg: string }> = {
  danger: { color: "red", bg: "bg-red-50" },
  warning: { color: "amber", bg: "bg-amber-50" },
  info: { color: "blue", bg: "bg-blue-50" },
};

const statusColor: Record<string, "green" | "amber" | "gray"> = {
  active: "green",
  planned: "amber",
  completed: "gray",
};

const NgoDashboard = () => {
  useEffect(() => {
    document.title = "NGO / Government Dashboard | AGRISENSE";
  }, []);

  return (
    <RoleLayout
      links={ngoLinks}
      roleLabel="NGO / Government"
      accent={NGO_ACCENT}
      title="Impact Overview"
      subtitle="Monitor programs, regional reach and food-security signals."
    >
      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Farmers Reached" value="9,000" delta="+20%" accent={NGO_ACCENT} />
        <StatCard icon={MapPinned} label="Regions Covered" value={5} delta="All provinces" accent={NGO_ACCENT} />
        <StatCard icon={HeartHandshake} label="Active Programs" value={3} delta="1 planned" accent={NGO_ACCENT} />
        <StatCard icon={Wallet} label="Funding Disbursed" value="$425K" delta="+$60K" accent={NGO_ACCENT} />
      </div>

      {/* Charts */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Panel title="Farmer Adoption" className="lg:col-span-2">
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ngoAdoption} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="ngoAdopt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={NGO_ACCENT} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={NGO_ACCENT} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="farmers" stroke={NGO_ACCENT} strokeWidth={2} fill="url(#ngoAdopt)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Food-Security Alerts">
          <ul className="space-y-3">
            {ngoAlerts.map((a) => (
              <li key={a.id} className={`rounded-lg p-3 ${alertStyle[a.level].bg}`}>
                <div className="flex items-center gap-2">
                  <AlertTriangle
                    className={`h-4 w-4 ${
                      a.level === "danger"
                        ? "text-red-500"
                        : a.level === "warning"
                          ? "text-amber-500"
                          : "text-blue-500"
                    }`}
                  />
                  <span className="text-sm font-semibold text-gray-800">{a.region}</span>
                  <Badge color={alertStyle[a.level].color}>{a.level}</Badge>
                </div>
                <p className="mt-1 text-xs text-gray-600">{a.message}</p>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      {/* Regional coverage + programs */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Panel title="Regional Coverage (farmers)" className="lg:col-span-1">
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ngoRegions} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="region" axisLine={false} tickLine={false} fontSize={11} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="farmers" fill={NGO_ACCENT} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Active Programs" className="lg:col-span-2">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs uppercase text-gray-400">
                  <th className="pb-2 font-medium">Program</th>
                  <th className="pb-2 font-medium">Region</th>
                  <th className="pb-2 font-medium">Farmers</th>
                  <th className="pb-2 font-medium">Progress</th>
                  <th className="pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {ngoPrograms.map((p) => (
                  <tr key={p.id} className="border-b last:border-0">
                    <td className="py-3 font-medium text-gray-800">{p.name}</td>
                    <td className="py-3 text-gray-500">{p.region}</td>
                    <td className="py-3 text-gray-600">{p.farmers.toLocaleString()}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-gray-100">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${p.progress}%`, backgroundColor: NGO_ACCENT }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">{p.progress}%</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <Badge color={statusColor[p.status]}>{p.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </RoleLayout>
  );
};

export default NgoDashboard;
