import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/useAuth";
import { routes } from "@/lib/routes";

interface SidebarLinks {
  title: string;
  icon: string;
  path: string;
  end?: boolean;
}

interface SideBarProps {
  /** Called after a nav link is clicked (used to close the mobile drawer). */
  onNavigate?: () => void;
  /** Slightly tighter padding when rendered inside the mobile drawer. */
  compact?: boolean;
}

const SideBar = ({ onNavigate, compact = false }: SideBarProps) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const Links: SidebarLinks[] = [
    { title: "Dashboard", icon: "/assets/Dashboardicons/Dashboard.svg", path: routes.app.root, end: true },
    { title: "Crop Care", icon: "/assets/Dashboardicons/cropcare.svg", path: routes.app.cropCare },
    { title: "Weather", icon: "/assets/Dashboardicons/weather.svg", path: routes.app.weather },
    { title: "Analytics", icon: "/assets/Dashboardicons/analysis.svg", path: routes.app.analytics },
    { title: "Community", icon: "/assets/Dashboardicons/community.svg", path: routes.app.community },
    { title: "Help & Support", icon: "/assets/Dashboardicons/help.svg", path: routes.app.help },
    { title: "Subscription", icon: "/assets/Dashboardicons/settings.svg", path: routes.app.subscription },
    { title: "Settings", icon: "/assets/Dashboardicons/settings.svg", path: routes.app.settings },
  ];

  const handleLogout = async () => {
    await logout();
    navigate(routes.auth.login, { replace: true });
  };

  return (
    <aside
      className={`flex h-full w-64 flex-col border-r bg-white shadow-sm ${
        compact ? "p-4" : "p-5 md:p-6"
      }`}
    >
      <div className="mb-6 flex items-center gap-2 md:mb-8">
        <img src="/assets/logo.png" alt="Logo" className="h-11 w-auto" />
        <h1 className="text-lg font-bold">
          <span className="text-green-600">AGRI</span>SENSE
        </h1>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
        {Links.map((link) => (
          <NavLink
            to={link.path}
            end={link.end}
            key={link.path}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-2.5 transition ${
                isActive
                  ? "bg-green-100 font-semibold text-[#377552]"
                  : "text-gray-700 hover:bg-green-100"
              }`
            }
          >
            <img className="h-5 w-5 shrink-0" src={link.icon} alt="" />
            <span className="text-sm">{link.title}</span>
          </NavLink>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="mt-4 flex items-center gap-3 rounded-md px-3 py-2.5 text-gray-700 transition hover:bg-red-50 hover:text-red-600"
      >
        <img className="h-5 w-5" src="/assets/Dashboardicons/Logout.svg" alt="" />
        <span className="text-sm">Logout</span>
      </button>
    </aside>
  );
};

export default SideBar;
