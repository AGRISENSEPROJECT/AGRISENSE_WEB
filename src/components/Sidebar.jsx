import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { LogOut, Sprout } from "lucide-react";
import { roleFromPath } from "../data/roles.js";

export default function Sidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const role = roleFromPath(pathname);

  return (
    <aside className="sticky top-0 flex h-screen w-60 shrink-0 flex-col border-r border-gray-100 bg-white">
      <div className="flex items-center gap-2 px-6 py-6">
        <Sprout className="h-7 w-7 text-leaf" strokeWidth={2.5} />
        <span className="text-lg font-bold tracking-wide">
          <span className="text-leaf">AGRI</span>
          <span className="text-ink">SENSE</span>
        </span>
      </div>

      <p className="px-6 pb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
        {role.label} portal
      </p>

      <nav className="flex flex-1 flex-col gap-1 px-3">
        {role.nav.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-mint-pale text-forest"
                  : "text-gray-600 hover:bg-gray-50 hover:text-forest"
              }`
            }
          >
            <Icon className="h-5 w-5" strokeWidth={1.8} />
            {label}
          </NavLink>
        ))}

        <button
          onClick={() => navigate("/")}
          className="mt-auto mb-6 flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-forest"
        >
          <LogOut className="h-5 w-5" strokeWidth={1.8} />
          Logout
        </button>
      </nav>
    </aside>
  );
}
