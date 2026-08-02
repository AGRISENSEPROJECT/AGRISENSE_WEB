import { useEffect, useState } from "react";
import RoleLayout from "../RoleLayout";
import { Panel, Badge } from "../ui";
import { ADMIN_ACCENT, adminLinks } from "./config";
import { adminUsers } from "./mock";

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

const ROLES = ["All", "Farmer", "Supplier", "NGO", "Government", "Admin"] as const;

const AdminUsers = () => {
  const [filter, setFilter] = useState<(typeof ROLES)[number]>("All");

  useEffect(() => {
    document.title = "Users | Admin | AGRISENSE";
  }, []);

  const rows = filter === "All" ? adminUsers : adminUsers.filter((u) => u.role === filter);

  return (
    <RoleLayout
      links={adminLinks}
      roleLabel="Admin Console"
      accent={ADMIN_ACCENT}
      title="User Management"
      subtitle="Search, filter and manage all platform accounts."
    >
      <Panel>
        {/* Role filter */}
        <div className="mb-4 flex flex-wrap gap-2">
          {ROLES.map((r) => (
            <button
              key={r}
              onClick={() => setFilter(r)}
              className="rounded-full border px-3 py-1 text-xs font-medium transition-colors"
              style={
                filter === r
                  ? { backgroundColor: ADMIN_ACCENT, color: "#fff", borderColor: ADMIN_ACCENT }
                  : { color: "#4b5563" }
              }
            >
              {r}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase text-gray-400">
                <th className="pb-2 font-medium">ID</th>
                <th className="pb-2 font-medium">User</th>
                <th className="pb-2 font-medium">Email</th>
                <th className="pb-2 font-medium">Role</th>
                <th className="pb-2 font-medium">Status</th>
                <th className="pb-2 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((u) => (
                <tr key={u.id} className="border-b last:border-0">
                  <td className="py-3 font-medium text-gray-800">{u.id}</td>
                  <td className="py-3 text-gray-700">{u.name}</td>
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
    </RoleLayout>
  );
};

export default AdminUsers;
