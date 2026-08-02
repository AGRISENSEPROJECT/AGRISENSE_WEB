// Mock data for the Admin dashboard.
// TODO: Replace every export here with real Admin API calls once available.

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "Farmer" | "Supplier" | "NGO" | "Government" | "Admin";
  status: "active" | "pending" | "suspended";
  joined: string;
}

export interface ModerationItem {
  id: string;
  author: string;
  excerpt: string;
  reason: string;
  reportedAt: string;
}

export const adminUsers: AdminUser[] = [
  { id: "U-2041", name: "Jean Habimana", email: "jean@example.com", role: "Farmer", status: "active", joined: "2026-07-30" },
  { id: "U-2040", name: "AgriCo Supplies", email: "sales@agrico.rw", role: "Supplier", status: "pending", joined: "2026-07-29" },
  { id: "U-2039", name: "Rwanda Green NGO", email: "contact@rwgreen.org", role: "NGO", status: "active", joined: "2026-07-28" },
  { id: "U-2038", name: "Alice Uwase", email: "alice@example.com", role: "Farmer", status: "active", joined: "2026-07-27" },
  { id: "U-2037", name: "MINAGRI Office", email: "info@minagri.gov.rw", role: "Government", status: "active", joined: "2026-07-26" },
  { id: "U-2036", name: "Eric Niyonzima", email: "eric@example.com", role: "Farmer", status: "suspended", joined: "2026-07-25" },
];

export const adminModeration: ModerationItem[] = [
  { id: "M-311", author: "Unknown", excerpt: "Buy cheap fertilizer here www.spam-link…", reason: "Spam / advertising", reportedAt: "2026-08-01" },
  { id: "M-310", author: "Eric N.", excerpt: "This advice is completely wrong and…", reason: "Harassment", reportedAt: "2026-07-31" },
  { id: "M-309", author: "Sarah M.", excerpt: "Contact me on +250…", reason: "Personal info", reportedAt: "2026-07-30" },
];

export const adminUserGrowth = [
  { month: "Feb", users: 420 },
  { month: "Mar", users: 610 },
  { month: "Apr", users: 780 },
  { month: "May", users: 1020 },
  { month: "Jun", users: 1340 },
  { month: "Jul", users: 1720 },
];

export const adminRoleSplit = [
  { name: "Farmers", value: 1180, color: "#4338CA" },
  { name: "Suppliers", value: 240, color: "#6366F1" },
  { name: "NGOs", value: 180, color: "#A5B4FC" },
  { name: "Government", value: 120, color: "#C7D2FE" },
];
