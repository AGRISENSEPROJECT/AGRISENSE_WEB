import {
  LayoutDashboard,
  HeartHandshake,
  MapPinned,
  Users,
  FileBarChart,
  Settings,
  Bell,
  ShieldAlert,
  Megaphone,
} from "lucide-react";
import type { RoleNavLink } from "../RoleLayout";

export const NGO_ACCENT = "#2C6E49";

export const ngoLinks: RoleNavLink[] = [
  { title: "Overview", to: "/ngo", icon: LayoutDashboard, end: true },
  { title: "Regional Intel", to: "/ngo/regions", icon: MapPinned },
  { title: "Disease & Risk", to: "/ngo/disease-risk", icon: ShieldAlert },
  { title: "Programs", to: "/ngo/programs", icon: HeartHandshake },
  { title: "Advisories", to: "/ngo/advisories", icon: Megaphone },
  { title: "Farmers", to: "/ngo/farmers", icon: Users },
  { title: "Reports", to: "/ngo/reports", icon: FileBarChart },
  { title: "Notifications", to: "/ngo/notifications", icon: Bell },
  { title: "Settings", to: "/ngo/settings", icon: Settings },
];
