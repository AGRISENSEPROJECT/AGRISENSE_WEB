// Mock data for the Supplier dashboard.
// TODO: Replace every export here with real Supplier API calls once available.

export interface SupplierProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  unit: string;
  status: "in_stock" | "low_stock" | "out_of_stock";
}

export interface SupplierOrder {
  id: string;
  buyer: string;
  product: string;
  qty: number;
  total: number;
  date: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
}

export const supplierProducts: SupplierProduct[] = [
  { id: "P-1001", name: "Maize Seeds (Hybrid)", category: "Seeds", price: 12.5, stock: 320, unit: "kg", status: "in_stock" },
  { id: "P-1002", name: "NPK Fertilizer 17-17-17", category: "Fertilizer", price: 45.0, stock: 18, unit: "bag", status: "low_stock" },
  { id: "P-1003", name: "Drip Irrigation Kit", category: "Equipment", price: 220.0, stock: 12, unit: "set", status: "in_stock" },
  { id: "P-1004", name: "Bean Seeds (Climbing)", category: "Seeds", price: 9.0, stock: 0, unit: "kg", status: "out_of_stock" },
  { id: "P-1005", name: "Organic Pesticide", category: "Chemicals", price: 30.0, stock: 64, unit: "L", status: "in_stock" },
  { id: "P-1006", name: "Knapsack Sprayer 16L", category: "Equipment", price: 55.0, stock: 7, unit: "unit", status: "low_stock" },
];

export const supplierOrders: SupplierOrder[] = [
  { id: "ORD-5521", buyer: "Jean Habimana", product: "Maize Seeds (Hybrid)", qty: 40, total: 500, date: "2026-08-01", status: "pending" },
  { id: "ORD-5520", buyer: "Alice Uwase", product: "NPK Fertilizer 17-17-17", qty: 10, total: 450, date: "2026-07-31", status: "processing" },
  { id: "ORD-5519", buyer: "Green Valley Coop", product: "Drip Irrigation Kit", qty: 3, total: 660, date: "2026-07-30", status: "shipped" },
  { id: "ORD-5518", buyer: "Eric Niyonzima", product: "Organic Pesticide", qty: 12, total: 360, date: "2026-07-29", status: "delivered" },
  { id: "ORD-5517", buyer: "Sarah Mukamana", product: "Knapsack Sprayer 16L", qty: 2, total: 110, date: "2026-07-28", status: "cancelled" },
];

export const supplierSales = [
  { month: "Feb", revenue: 4200, orders: 42 },
  { month: "Mar", revenue: 5100, orders: 55 },
  { month: "Apr", revenue: 4800, orders: 49 },
  { month: "May", revenue: 6300, orders: 61 },
  { month: "Jun", revenue: 7200, orders: 70 },
  { month: "Jul", revenue: 8100, orders: 83 },
];

export const supplierTopProducts = [
  { name: "Maize Seeds", value: 38, color: "#0F766E" },
  { name: "Fertilizer", value: 27, color: "#14B8A6" },
  { name: "Equipment", value: 20, color: "#5EEAD4" },
  { name: "Pesticides", value: 15, color: "#99F6E4" },
];
