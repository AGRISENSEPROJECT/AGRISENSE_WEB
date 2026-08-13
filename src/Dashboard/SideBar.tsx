import { NavLink, useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import { useAuth } from "@/context/useAuth";
import { usePlanEntitlements } from "@/hooks/usePlanEntitlements";
import { routes } from "@/lib/routes";
import {
  canAccessFeature,
  planDisplayName,
  type FarmerFeature,
} from "@/lib/planEntitlements";

interface SidebarLinks {
  title: string;
  icon: string;
  path: string;
  end?: boolean;
  feature: FarmerFeature;
}

interface SideBarProps {
  onNavigate?: () => void;
  compact?: boolean;
}

const SideBar = ({ onNavigate, compact = false }: SideBarProps) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const entitlements = usePlanEntitlements();

  const Links: SidebarLinks[] = [
    { title: "Dashboard", icon: "/assets/Dashboardicons/Dashboard.svg", path: routes.app.root, end: true, feature: "dashboard" },
    { title: "Notifications", icon: "/assets/Dashboardicons/notification.svg", path: routes.app.notifications, feature: "notifications" },
    { title: "Marketplace", icon: "/assets/Dashboardicons/cropcare.svg", path: routes.app.marketplace, feature: "marketplace" },
    { title: "Orders", icon: "/assets/Dashboardicons/community.svg", path: routes.app.orders, feature: "orders" },
    { title: "Prediction History", icon: "/assets/Dashboardicons/analysis.svg", path: routes.app.predictionHistory, feature: "predictionHistory" },
    { title: "Crop Care", icon: "/assets/Dashboardicons/cropcare.svg", path: routes.app.cropCare, feature: "cropCare" },
    { title: "Weather", icon: "/assets/Dashboardicons/weather.svg", path: routes.app.weather, feature: "weather" },
    { title: "Analytics", icon: "/assets/Dashboardicons/analysis.svg", path: routes.app.analytics, feature: "analytics" },
    { title: "Community", icon: "/assets/Dashboardicons/community.svg", path: routes.app.community, feature: "community" },
    { title: "Messages", icon: "/assets/Dashboardicons/notification.svg", path: routes.app.messages, feature: "messages" },
    { title: "Help & Support", icon: "/assets/Dashboardicons/help.svg", path: routes.app.help, feature: "help" },
    { title: "Subscription", icon: "/assets/Dashboardicons/settings.svg", path: routes.app.subscription, feature: "subscription" },
    { title: "Settings", icon: "/assets/Dashboardicons/settings.svg", path: routes.app.settings, feature: "settings" },
  ];

  const visibleLinks = Links.filter((link) => canAccessFeature(entitlements, link.feature));

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
        <div>
          <h1 className="text-lg font-bold">
            <span className="text-green-600">AGRI</span>SENSE
          </h1>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
            {planDisplayName(entitlements.planId)} plan
          </p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
        {visibleLinks.map((link) => (
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

        {!entitlements.isPaid && (
          <button
            type="button"
            onClick={() => {
              onNavigate?.();
              navigate(routes.app.subscription, { state: { plan: "pro" } });
            }}
            className="mt-2 flex items-center gap-3 rounded-md border border-dashed border-amber-300 bg-amber-50 px-3 py-2.5 text-left text-amber-900 transition hover:bg-amber-100"
          >
            <Lock className="h-4 w-4 shrink-0" />
            <span className="text-sm font-medium">Unlock Pro features</span>
          </button>
        )}
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
