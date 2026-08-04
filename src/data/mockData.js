export const supplier = {
  name: "Chance Regine",
  email: "chanceregine4@gmail.com",
  companyName: "Regine Agro Supplies Ltd",
  phone: "+250 788 123 456",
  warehouseAddress: "KK 15 Ave, Kigali Industrial Zone",
  certifications: ["Organic Certified", "RSB Licensed"],
};

export const kpis = [
  { label: "Active products", value: "12 Types", trend: "+2% in good state" },
  { label: "Monthly volume", value: "450 tons", trend: "+2% in good state" },
  { label: "Fulfillment rate", value: "85%", trend: "+2% in good state" },
  { label: "Next delivery", value: "Sep 15, 2024", trend: "+2% in good state" },
];

export const supplyMix = [
  { name: "Maize supply", value: 40 },
  { name: "Rice supply", value: 35 },
  { name: "Bean supply", value: 25 },
];

export const supplyVolume = [
  { month: "JAN", maize: 4.2, rice: 6.5 },
  { month: "FEB", maize: 5.8, rice: 5.2 },
  { month: "MAR", maize: 8.4, rice: 4.0 },
  { month: "APR", maize: 7.2, rice: 5.6 },
  { month: "MAY", maize: 4.6, rice: 7.4 },
  { month: "JUN", maize: 5.4, rice: 6.2 },
  { month: "JUL", maize: 4.8, rice: 8.5 },
  { month: "AUG", maize: 6.2, rice: 6.8 },
  { month: "SEP", maize: 5.6, rice: 5.4 },
  { month: "OCT", maize: 6.8, rice: 6.6 },
  { month: "NOV", maize: 7.4, rice: 5.8 },
  { month: "DEC", maize: 4.4, rice: 6.0 },
];

export const orderActivity = [
  { month: "JAN", fulfilled: 1.2, incoming: 2.4 },
  { month: "FEB", fulfilled: 2.6, incoming: 4.2 },
  { month: "MAR", fulfilled: 3.4, incoming: 7.2 },
  { month: "APR", fulfilled: 2.8, incoming: 5.4 },
  { month: "MAY", fulfilled: 5.2, incoming: 7.6 },
  { month: "JUN", fulfilled: 6.4, incoming: 8.8 },
];

export const orders = [
  { id: "ORD-1042", buyer: "GreenFarm Co", product: "Maize", qty: "20 t", unitPrice: 320, total: 6400, status: "Confirmed", deliveryDate: "Sep 15, 2024" },
  { id: "ORD-1041", buyer: "Valley Agro", product: "Rice", qty: "12 t", unitPrice: 540, total: 6480, status: "Packed", deliveryDate: "Sep 12, 2024" },
  { id: "ORD-1040", buyer: "Kigali Mills", product: "Maize", qty: "35 t", unitPrice: 315, total: 11025, status: "Shipped", deliveryDate: "Sep 8, 2024" },
  { id: "ORD-1039", buyer: "AgroDirect", product: "Beans", qty: "8 t", unitPrice: 610, total: 4880, status: "Pending", deliveryDate: "Sep 20, 2024" },
  { id: "ORD-1038", buyer: "FreshHarvest Ltd", product: "Rice", qty: "16 t", unitPrice: 535, total: 8560, status: "Delivered", deliveryDate: "Aug 30, 2024" },
  { id: "ORD-1037", buyer: "GreenFarm Co", product: "Beans", qty: "10 t", unitPrice: 600, total: 6000, status: "Delivered", deliveryDate: "Aug 25, 2024" },
  { id: "ORD-1036", buyer: "Hillside Traders", product: "Maize", qty: "14 t", unitPrice: 325, total: 4550, status: "Cancelled", deliveryDate: "Aug 22, 2024" },
];

export const products = [
  { id: "SKU-001", name: "Maize (Grade A)", category: "Produce", onHand: 180, reserved: 55, reorderLevel: 40, unit: "tons" },
  { id: "SKU-002", name: "Rice (Long grain)", category: "Produce", onHand: 140, reserved: 28, reorderLevel: 35, unit: "tons" },
  { id: "SKU-003", name: "Beans (Red kidney)", category: "Produce", onHand: 62, reserved: 18, reorderLevel: 20, unit: "tons" },
  { id: "SKU-004", name: "Maize seed (Hybrid)", category: "Seeds", onHand: 12, reserved: 4, reorderLevel: 10, unit: "tons" },
  { id: "SKU-005", name: "Rice seed (Basmati)", category: "Seeds", onHand: 6, reserved: 3, reorderLevel: 8, unit: "tons" },
  { id: "SKU-006", name: "NPK Fertilizer 17-17-17", category: "Fertilizers", onHand: 90, reserved: 20, reorderLevel: 30, unit: "tons" },
];

export const deliveries = [
  { id: "DLV-208", orderId: "ORD-1042", buyer: "GreenFarm Co", route: "Kigali → Musanze", driver: "J. Mugisha", eta: "Sep 15, 2024", status: "Scheduled" },
  { id: "DLV-207", orderId: "ORD-1041", buyer: "Valley Agro", route: "Kigali → Huye", driver: "A. Uwase", eta: "Sep 12, 2024", status: "Scheduled" },
  { id: "DLV-206", orderId: "ORD-1040", buyer: "Kigali Mills", route: "Warehouse B → Kigali", driver: "E. Nkurunziza", eta: "Sep 8, 2024", status: "In transit" },
  { id: "DLV-205", orderId: "ORD-1038", buyer: "FreshHarvest Ltd", route: "Kigali → Rubavu", driver: "J. Mugisha", eta: "Aug 30, 2024", status: "Delivered" },
  { id: "DLV-204", orderId: "ORD-1037", buyer: "GreenFarm Co", route: "Kigali → Musanze", driver: "A. Uwase", eta: "Aug 25, 2024", status: "Delivered" },
  { id: "DLV-203", orderId: "ORD-1035", buyer: "Hillside Traders", route: "Kigali → Nyagatare", driver: "E. Nkurunziza", eta: "Aug 24, 2024", status: "Delayed" },
];

export const buyers = [
  { id: 1, name: "GreenFarm Co", contact: "sales@greenfarm.rw", location: "Musanze", ordersYtd: 24, volume: "310 t", lastOrder: "Sep 2, 2024", status: "Active" },
  { id: 2, name: "Valley Agro", contact: "orders@valleyagro.rw", location: "Huye", ordersYtd: 18, volume: "215 t", lastOrder: "Sep 1, 2024", status: "Active" },
  { id: 3, name: "Kigali Mills", contact: "procurement@kgmills.rw", location: "Kigali", ordersYtd: 31, volume: "540 t", lastOrder: "Aug 28, 2024", status: "Active" },
  { id: 4, name: "AgroDirect", contact: "buy@agrodirect.rw", location: "Rwamagana", ordersYtd: 9, volume: "88 t", lastOrder: "Aug 20, 2024", status: "Active" },
  { id: 5, name: "FreshHarvest Ltd", contact: "supply@freshharvest.rw", location: "Rubavu", ordersYtd: 12, volume: "142 t", lastOrder: "Aug 15, 2024", status: "Active" },
  { id: 6, name: "Hillside Traders", contact: "info@hillside.rw", location: "Nyagatare", ordersYtd: 4, volume: "37 t", lastOrder: "Jul 30, 2024", status: "Inactive" },
];

export const revenueByMonth = [
  { month: "JAN", revenue: 18.4 },
  { month: "FEB", revenue: 22.1 },
  { month: "MAR", revenue: 27.8 },
  { month: "APR", revenue: 24.3 },
  { month: "MAY", revenue: 31.6 },
  { month: "JUN", revenue: 29.4 },
  { month: "JUL", revenue: 35.2 },
  { month: "AUG", revenue: 33.8 },
];

export const fulfillmentTrend = [
  { month: "JAN", rate: 78 },
  { month: "FEB", rate: 81 },
  { month: "MAR", rate: 79 },
  { month: "APR", rate: 84 },
  { month: "MAY", rate: 86 },
  { month: "JUN", rate: 83 },
  { month: "JUL", rate: 87 },
  { month: "AUG", rate: 85 },
];

export const buyerConcentration = [
  { name: "Kigali Mills", value: 38 },
  { name: "GreenFarm Co", value: 23 },
  { name: "Valley Agro", value: 16 },
  { name: "FreshHarvest", value: 11 },
  { name: "Others", value: 12 },
];
