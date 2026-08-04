export const govKpis = [
  { label: "Registered farmers", value: "24,500", trend: "+4% this quarter" },
  { label: "Registered suppliers", value: "340", trend: "+12 new this month" },
  { label: "Subsidy budget used", value: "68%", trend: "+5% vs last quarter" },
  { label: "Food security index", value: "7.4 / 10", trend: "+0.3 vs last season" },
];

export const regionalProduction = [
  { name: "Eastern", value: 32 },
  { name: "Southern", value: 24 },
  { name: "Northern", value: 21 },
  { name: "Western", value: 15 },
  { name: "Kigali", value: 8 },
];

export const nationalProduction = [
  { month: "JAN", maize: 42, rice: 31 },
  { month: "FEB", maize: 48, rice: 29 },
  { month: "MAR", maize: 61, rice: 34 },
  { month: "APR", maize: 55, rice: 40 },
  { month: "MAY", maize: 49, rice: 45 },
  { month: "JUN", maize: 52, rice: 41 },
  { month: "JUL", maize: 58, rice: 38 },
  { month: "AUG", maize: 63, rice: 36 },
  { month: "SEP", maize: 57, rice: 42 },
  { month: "OCT", maize: 60, rice: 44 },
  { month: "NOV", maize: 66, rice: 39 },
  { month: "DEC", maize: 54, rice: 37 },
];

export const subsidyActivity = [
  { month: "JAN", disbursed: 1.8, requested: 2.6 },
  { month: "FEB", disbursed: 2.2, requested: 3.4 },
  { month: "MAR", disbursed: 3.1, requested: 4.8 },
  { month: "APR", disbursed: 2.7, requested: 3.9 },
  { month: "MAY", disbursed: 3.8, requested: 5.2 },
  { month: "JUN", disbursed: 4.4, requested: 6.1 },
];

export const regions = [
  { name: "Eastern Province", mainCrops: "Maize, Beans", production: "128,400 t", farmers: 7820, foodSecurity: "8.1", status: "On track" },
  { name: "Southern Province", mainCrops: "Rice, Cassava", production: "96,300 t", farmers: 6140, foodSecurity: "7.6", status: "On track" },
  { name: "Northern Province", mainCrops: "Irish potato, Maize", production: "84,100 t", farmers: 5390, foodSecurity: "7.2", status: "On track" },
  { name: "Western Province", mainCrops: "Tea, Beans", production: "60,900 t", farmers: 4210, foodSecurity: "6.4", status: "At risk" },
  { name: "Kigali City", mainCrops: "Vegetables", production: "31,200 t", farmers: 940, foodSecurity: "8.5", status: "On track" },
];

export const subsidyPrograms = [
  { id: "SUB-014", name: "Seed subsidy 2026A", crop: "Maize", budget: "4.2B RWF", disbursed: "3.1B RWF", beneficiaries: 9800, status: "Active" },
  { id: "SUB-013", name: "Fertilizer support", crop: "All crops", budget: "6.0B RWF", disbursed: "4.4B RWF", beneficiaries: 14200, status: "Active" },
  { id: "SUB-012", name: "Irrigation grant", crop: "Rice", budget: "2.8B RWF", disbursed: "2.8B RWF", beneficiaries: 3600, status: "Closed" },
  { id: "SUB-011", name: "Post-harvest storage", crop: "Maize, Beans", budget: "1.5B RWF", disbursed: "0.9B RWF", beneficiaries: 2100, status: "Active" },
  { id: "SUB-010", name: "Seed subsidy 2025B", crop: "Beans", budget: "3.4B RWF", disbursed: "3.4B RWF", beneficiaries: 8700, status: "Closed" },
];

export const registry = [
  { name: "Regine Agro Supplies Ltd", type: "Supplier", region: "Kigali", license: "LIC-2024-0871", since: "2024", status: "Licensed" },
  { name: "GreenFarm Co", type: "Buyer / Cooperative", region: "Musanze", license: "LIC-2023-0442", since: "2023", status: "Licensed" },
  { name: "Valley Agro", type: "Buyer", region: "Huye", license: "LIC-2024-0119", since: "2024", status: "Licensed" },
  { name: "Kigali Mills", type: "Processor", region: "Kigali", license: "LIC-2022-0067", since: "2022", status: "Licensed" },
  { name: "Hillside Traders", type: "Supplier", region: "Nyagatare", license: "LIC-2025-0203", since: "2025", status: "Pending review" },
  { name: "SunAgro Ltd", type: "Supplier", region: "Rubavu", license: "LIC-2021-0330", since: "2021", status: "Suspended" },
];

export const reports = [
  { title: "National Crop Production — Q2 2026", desc: "Quarterly production volumes by province and crop.", date: "Jul 15, 2026" },
  { title: "Subsidy Disbursement Report — 2026A Season", desc: "Budget utilization and beneficiary reach per program.", date: "Jun 30, 2026" },
  { title: "Food Security Assessment — Western Province", desc: "Household-level assessment and risk mapping.", date: "Jun 12, 2026" },
  { title: "Supplier Compliance Audit — H1 2026", desc: "License status and inspection outcomes for registered suppliers.", date: "May 28, 2026" },
];
