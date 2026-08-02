import {
  LayoutDashboard,
  HeartHandshake,
  MapPinned,
  Users,
  FileBarChart,
  Settings,
} from "lucide-react";
import type { RoleNavLink } from "../RoleLayout";

export const NGO_ACCENT = "#2C6E49"; // AgriSense green

export const ngoLinks: RoleNavLink[] = [
  { title: "Overview", to: "/ngo", icon: LayoutDashboard, end: true },
  { title: "Programs", to: "/ngo/programs", icon: HeartHandshake },
  { title: "Regions", to: "/ngo/regions", icon: MapPinned },
  { title: "Farmers", to: "/ngo/farmers", icon: Users },
  { title: "Reports", to: "/ngo/reports", icon: FileBarChart },
  { title: "Settings", to: "/ngo/settings", icon: Settings },
];
