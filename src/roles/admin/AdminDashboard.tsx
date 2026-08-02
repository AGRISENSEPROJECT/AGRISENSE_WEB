import { useEffect } from "react";
import { Users, Store, Building2, ShieldAlert, UserCheck } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
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
import { ADMIN_ACCENT, adminLinks } from "./config";
import { adminUsers, adminModeration, adminUserGrowth, adminRoleSplit } from "./mock";

const roleColor: Record<string, "green" | "amber" | "red" | "blue" | "gray" | "purple"> = {
  Farmer: "green",
  Supplier: "blue",
  NGO: "purple",
  Government: "amber",
  Admin: "gray",
};

const statusColor: Record<string, "green" | "amber" | "red"> = {
  active: "green",
  pending: "amber",
  suspended: "red",
};

const AdminDashboard = () => {
  useEffect(() => {
    document.title = "Admin Dashboard | AGRISENSE";
  }, []);

  return (
    <RoleLayout
      links={adminLinks}
      roleLabel="Admin Console"
      accent={ADMIN_ACCENT}
      title="Admin Overview"
      subtitle="Platform-wide users, growth and moderation."
    >
      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Total Users" value="1,720" delta="+22.4%" accent={ADMIN_ACCENT} />
        <StatCard icon={Store} label="Suppliers" value={240} delta="+8 pending" accent={ADMIN_ACCENT} />
        <StatCard icon={Building2} label="NGOs / Gov" value={300} delta="+3" accent={ADMIN_ACCENT} />
        <StatCard icon={UserCheck} label="Active Today" value={412} delta="+5.1%" accent={ADMIN_ACCENT} />
      </div>

      {/* Charts */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Panel title="User Growth" className="lg:col-span-2">
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={adminUserGrowth} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke={ADMIN_ACCENT} strokeWidth={2.5} dot={false} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Users by Role">
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={adminRoleSplit} cx="50%" cy="45%" innerRadius={55} outerRadius={85} paddingAngle={2} dataKey="value">
                  {adminRoleSplit.map((e) => (
                    <Cell key={e.name} fill={e.color} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      {/* Recent users + moderation queue */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Panel title="Recent Signups" className="lg:col-span-2">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs uppercase text-gray-400">
                  <th className="pb-2 font-medium">User</th>
                  <th className="pb-2 font-medium">Email</th>
                  <th className="pb-2 font-medium">Role</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {adminUsers.map((u) => (
                  <tr key={u.id} className="border-b last:border-0">
                    <td className="py-3 font-medium text-gray-800">{u.name}</td>
                    <td className="py-3 text-gray-500">{u.email}</td>
                    <td className="py-3">
                      <Badge color={roleColor[u.role]}>{u.role}</Badge>
                    </td>
                    <td className="py-3">
                      <Badge color={statusColor[u.status]}>{u.status}</Badge>
                    </td>
                    <td className="py-3 text-gray-500">{u.joined}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title="Moderation Queue">
          <ul className="space-y-3">
            {adminModeration.map((m) => (
              <li key={m.id} className="rounded-lg border border-red-100 bg-red-50/60 p-3">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-semibold text-gray-800">{m.reason}</span>
                </div>
                <p className="mt-1 line-clamp-1 text-xs text-gray-600">"{m.excerpt}"</p>
                <p className="mt-1 text-[11px] text-gray-400">
                  {m.author} · {m.reportedAt}
                </p>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </RoleLayout>
  );
};

export default AdminDashboard;
