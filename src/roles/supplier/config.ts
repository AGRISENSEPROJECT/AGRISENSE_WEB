import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
} from "lucide-react";
import type { RoleNavLink } from "../RoleLayout";

export const SUPPLIER_ACCENT = "#0F766E"; // teal

export const supplierLinks: RoleNavLink[] = [
  { title: "Overview", to: "/supplier", icon: LayoutDashboard, end: true },
  { title: "Products", to: "/supplier/products", icon: Package },
  { title: "Orders", to: "/supplier/orders", icon: ShoppingCart },
  { title: "Buyers", to: "/supplier/buyers", icon: Users },
  { title: "Analytics", to: "/supplier/analytics", icon: BarChart3 },
  { title: "Settings", to: "/supplier/settings", icon: Settings },
];
