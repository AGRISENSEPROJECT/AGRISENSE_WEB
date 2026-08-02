// Mock data for the NGO / Government dashboard.
// TODO: Replace every export here with real NGO/Gov API calls once available.

export interface NgoProgram {
  id: string;
  name: string;
  region: string;
  farmers: number;
  budget: number;
  progress: number; // 0-100
  status: "active" | "planned" | "completed";
}

export interface RegionCoverage {
  region: string;
  farmers: number;
  hectares: number;
}

export const ngoPrograms: NgoProgram[] = [
  { id: "PRG-01", name: "Drought-Resistant Maize Rollout", region: "Eastern Province", farmers: 3200, budget: 120000, progress: 72, status: "active" },
  { id: "PRG-02", name: "Soil Health Training", region: "Northern Province", farmers: 1800, budget: 60000, progress: 45, status: "active" },
  { id: "PRG-03", name: "Irrigation Subsidy Scheme", region: "Southern Province", farmers: 2500, budget: 200000, progress: 30, status: "active" },
  { id: "PRG-04", name: "Post-Harvest Storage Grants", region: "Western Province", farmers: 900, budget: 45000, progress: 100, status: "completed" },
  { id: "PRG-05", name: "Climate-Smart Extension", region: "Kigali", farmers: 600, budget: 25000, progress: 0, status: "planned" },
];

export const ngoRegions: RegionCoverage[] = [
  { region: "Eastern", farmers: 3200, hectares: 18400 },
  { region: "Northern", farmers: 1800, hectares: 9200 },
  { region: "Southern", farmers: 2500, hectares: 12100 },
  { region: "Western", farmers: 900, hectares: 5300 },
  { region: "Kigali", farmers: 600, hectares: 2100 },
];

export const ngoAdoption = [
  { month: "Feb", farmers: 4200 },
  { month: "Mar", farmers: 4900 },
  { month: "Apr", farmers: 5600 },
  { month: "May", farmers: 6800 },
  { month: "Jun", farmers: 7500 },
  { month: "Jul", farmers: 9000 },
];

export const ngoCropSplit = [
  { name: "Maize", value: 34, color: "#2C6E49" },
  { name: "Beans", value: 24, color: "#4D8D6E" },
  { name: "Rice", value: 22, color: "#74B49B" },
  { name: "Cassava", value: 20, color: "#A7D7C5" },
];

export interface FoodSecurityAlert {
  id: string;
  region: string;
  level: "info" | "warning" | "danger";
  message: string;
}

export const ngoAlerts: FoodSecurityAlert[] = [
  { id: "AL-1", region: "Eastern Province", level: "danger", message: "Prolonged dry spell threatening maize yields — intervention advised." },
  { id: "AL-2", region: "Southern Province", level: "warning", message: "Below-average rainfall forecast for the next 2 weeks." },
  { id: "AL-3", region: "Northern Province", level: "info", message: "Soil health training uptake exceeding targets." },
];
