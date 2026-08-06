import {
  LayoutDashboard,
  Users,
  Store,
  ShieldCheck,
  BarChart3,
  Settings,
  Mail,
} from "lucide-react";
import type { RoleNavLink } from "../RoleLayout";

export const ADMIN_ACCENT = "#4338CA"; // indigo

export const adminLinks: RoleNavLink[] = [
  { title: "Overview", to: "/admin", icon: LayoutDashboard, end: true },
  { title: "Users", to: "/admin/users", icon: Users },
  { title: "Suppliers", to: "/admin/suppliers", icon: Store },
  { title: "Waitlist", to: "/admin/waitlist", icon: Mail },
  { title: "Moderation", to: "/admin/moderation", icon: ShieldCheck },
  { title: "Analytics", to: "/admin/analytics", icon: BarChart3 },
  { title: "Settings", to: "/admin/settings", icon: Settings },
];
