import {
  LayoutGrid,
  ShoppingCart,
  Package,
  Truck,
  ChartLine,
  Users,
  CircleHelp,
  Settings,
  Map,
  HandCoins,
  ClipboardList,
  FileText,
  HeartHandshake,
  Boxes,
  Wallet,
} from "lucide-react";

export const roles = {
  supplier: {
    key: "supplier",
    label: "Supplier",
    base: "/supplier",
    user: { name: "Chance Regine", email: "chanceregine4@gmail.com" },
    nav: [
      { to: "/supplier/dashboard", label: "Dashboard", icon: LayoutGrid },
      { to: "/supplier/orders", label: "Orders", icon: ShoppingCart },
      { to: "/supplier/inventory", label: "Inventory", icon: Package },
      { to: "/supplier/deliveries", label: "Deliveries", icon: Truck },
      { to: "/supplier/analytics", label: "Analytics", icon: ChartLine },
      { to: "/supplier/buyers", label: "Buyers", icon: Users },
      { to: "/supplier/help", label: "Help & Support", icon: CircleHelp },
      { to: "/supplier/settings", label: "Settings", icon: Settings },
    ],
    settingsSections: [
      {
        title: "Profile",
        fields: [
          { label: "Full name", value: "Chance Regine" },
          { label: "Email", value: "chanceregine4@gmail.com" },
          { label: "Phone", value: "+250 788 123 456" },
        ],
      },
      {
        title: "Business",
        fields: [
          { label: "Company name", value: "Regine Agro Supplies Ltd" },
          { label: "Registration / TIN", value: "TIN-102938475" },
          { label: "Supplier type", value: "Produce & farm inputs" },
          { label: "Certifications", value: "Organic Certified, RSB Licensed" },
        ],
      },
      {
        title: "Warehouse & logistics",
        fields: [
          { label: "Warehouse address", value: "KK 15 Ave, Kigali Industrial Zone" },
          { label: "Region", value: "Kigali" },
        ],
      },
      {
        title: "Banking",
        fields: [
          { label: "Payment method", value: "Bank transfer" },
          { label: "Account (masked)", value: "**** **** 4821" },
        ],
      },
    ],
  },

  gov: {
    key: "gov",
    label: "Government",
    base: "/gov",
    user: { name: "Aline Uwera", email: "a.uwera@minagri.gov.rw" },
    nav: [
      { to: "/gov/dashboard", label: "Dashboard", icon: LayoutGrid },
      { to: "/gov/regions", label: "Regions", icon: Map },
      { to: "/gov/subsidies", label: "Subsidies", icon: HandCoins },
      { to: "/gov/registry", label: "Registry", icon: ClipboardList },
      { to: "/gov/reports", label: "Reports", icon: FileText },
      { to: "/gov/help", label: "Help & Support", icon: CircleHelp },
      { to: "/gov/settings", label: "Settings", icon: Settings },
    ],
    settingsSections: [
      {
        title: "Profile",
        fields: [
          { label: "Full name", value: "Aline Uwera" },
          { label: "Email", value: "a.uwera@minagri.gov.rw" },
          { label: "Phone", value: "+250 788 555 010" },
        ],
      },
      {
        title: "Institution",
        fields: [
          { label: "Institution", value: "Ministry of Agriculture (MINAGRI)" },
          { label: "Department", value: "Crop Production & Food Security" },
          { label: "Role", value: "Regional Program Officer" },
          { label: "Office", value: "Kigali HQ" },
        ],
      },
    ],
  },

  ngo: {
    key: "ngo",
    label: "NGO",
    base: "/ngo",
    user: { name: "Eric Habimana", email: "eric@agrigrow.org" },
    nav: [
      { to: "/ngo/dashboard", label: "Dashboard", icon: LayoutGrid },
      { to: "/ngo/programs", label: "Programs", icon: HeartHandshake },
      { to: "/ngo/beneficiaries", label: "Beneficiaries", icon: Users },
      { to: "/ngo/distributions", label: "Distributions", icon: Boxes },
      { to: "/ngo/funding", label: "Funding", icon: Wallet },
      { to: "/ngo/help", label: "Help & Support", icon: CircleHelp },
      { to: "/ngo/settings", label: "Settings", icon: Settings },
    ],
    settingsSections: [
      {
        title: "Profile",
        fields: [
          { label: "Full name", value: "Eric Habimana" },
          { label: "Email", value: "eric@agrigrow.org" },
          { label: "Phone", value: "+250 788 777 202" },
        ],
      },
      {
        title: "Organization",
        fields: [
          { label: "Organization", value: "AgriGrow Foundation" },
          { label: "Registration No.", value: "NGO-RW-2019-0456" },
          { label: "Focus areas", value: "Seeds, Training, Irrigation" },
          { label: "Head office", value: "KG 9 Ave, Kigali" },
        ],
      },
    ],
  },
};

export function roleFromPath(pathname) {
  if (pathname.startsWith("/gov")) return roles.gov;
  if (pathname.startsWith("/ngo")) return roles.ngo;
  return roles.supplier;
}
