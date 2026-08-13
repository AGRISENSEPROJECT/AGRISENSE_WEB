import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  Bell,
} from "lucide-react";
import type { RoleNavLink } from "../RoleLayout";

export const SUPPLIER_ACCENT = "#0F766E"; // teal

export const supplierLinks: RoleNavLink[] = [
  { title: "Overview", to: "/supplier", icon: LayoutDashboard, end: true },
  { title: "Products", to: "/supplier/products", icon: Package },
  { title: "Orders", to: "/supplier/orders", icon: ShoppingCart },
  { title: "Buyers", to: "/supplier/buyers", icon: Users },
  { title: "Analytics", to: "/supplier/analytics", icon: BarChart3 },
  { title: "Notifications", to: "/supplier/notifications", icon: Bell },
  { title: "Settings", to: "/supplier/settings", icon: Settings },
];
