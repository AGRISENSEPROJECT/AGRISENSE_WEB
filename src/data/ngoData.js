export const ngoKpis = [
  { label: "Active programs", value: "8", trend: "+2 new this quarter" },
  { label: "Beneficiaries reached", value: "12,400", trend: "+8% this quarter" },
  { label: "Funds utilized", value: "74%", trend: "+6% vs plan" },
  { label: "Distributions this month", value: "32", trend: "+5 vs last month" },
];

export const programMix = [
  { name: "Seed support", value: 38 },
  { name: "Farmer training", value: 27 },
  { name: "Irrigation", value: 20 },
  { name: "Storage & tools", value: 15 },
];

export const beneficiariesReached = [
  { month: "JAN", planned: 800, reached: 640 },
  { month: "FEB", planned: 900, reached: 810 },
  { month: "MAR", planned: 1100, reached: 1050 },
  { month: "APR", planned: 1000, reached: 920 },
  { month: "MAY", planned: 1200, reached: 1180 },
  { month: "JUN", planned: 1300, reached: 1240 },
  { month: "JUL", planned: 1250, reached: 1310 },
  { month: "AUG", planned: 1400, reached: 1290 },
  { month: "SEP", planned: 1350, reached: 1300 },
  { month: "OCT", planned: 1450, reached: 1380 },
  { month: "NOV", planned: 1500, reached: 1420 },
  { month: "DEC", planned: 1200, reached: 1150 },
];

export const distributionActivity = [
  { month: "JAN", completed: 14, planned: 20 },
  { month: "FEB", completed: 18, planned: 24 },
  { month: "MAR", completed: 26, planned: 30 },
  { month: "APR", completed: 22, planned: 28 },
  { month: "MAY", completed: 30, planned: 34 },
  { month: "JUN", completed: 32, planned: 36 },
];

export const programs = [
  { id: "PRG-08", name: "Resilient Seeds 2026", focus: "Seed support", region: "Eastern", beneficiaries: 4200, budgetUsed: "81%", status: "Active" },
  { id: "PRG-07", name: "Smart Irrigation Pilot", focus: "Irrigation", region: "Southern", beneficiaries: 1600, budgetUsed: "64%", status: "Active" },
  { id: "PRG-06", name: "Agronomy Training Camp", focus: "Farmer training", region: "Northern", beneficiaries: 2800, budgetUsed: "72%", status: "Active" },
  { id: "PRG-05", name: "Post-harvest Storage", focus: "Storage & tools", region: "Western", beneficiaries: 1300, budgetUsed: "58%", status: "Active" },
  { id: "PRG-04", name: "Drought Relief 2025", focus: "Seed support", region: "Eastern", beneficiaries: 2500, budgetUsed: "100%", status: "Completed" },
];

export const beneficiaries = [
  { name: "Abahuzamugambi Coop", type: "Cooperative (240 farmers)", region: "Eastern", program: "Resilient Seeds 2026", support: "Maize & bean seed kits", since: "Jan 2026", status: "Active" },
  { name: "Twiyubake Farmers Group", type: "Group (85 farmers)", region: "Southern", program: "Smart Irrigation Pilot", support: "Drip irrigation kits", since: "Mar 2026", status: "Active" },
  { name: "Urumuri Women Coop", type: "Cooperative (150 farmers)", region: "Northern", program: "Agronomy Training Camp", support: "Training & starter kits", since: "Feb 2026", status: "Active" },
  { name: "Duterimbere Youth Coop", type: "Cooperative (110 farmers)", region: "Western", program: "Post-harvest Storage", support: "Storage silos & dryers", since: "Apr 2026", status: "Active" },
  { name: "Ejo Heza Group", type: "Group (60 farmers)", region: "Eastern", program: "Drought Relief 2025", support: "Emergency seed kits", since: "Aug 2025", status: "Completed" },
];

export const distributions = [
  { id: "DST-114", program: "Resilient Seeds 2026", items: "Maize seed kits", qty: "1,200 kits", region: "Eastern", date: "Sep 18, 2026", status: "Scheduled" },
  { id: "DST-113", program: "Smart Irrigation Pilot", items: "Drip irrigation sets", qty: "80 sets", region: "Southern", date: "Sep 10, 2026", status: "Scheduled" },
  { id: "DST-112", program: "Agronomy Training Camp", items: "Starter tool kits", qty: "450 kits", region: "Northern", date: "Sep 4, 2026", status: "In transit" },
  { id: "DST-111", program: "Post-harvest Storage", items: "Grain dryers", qty: "24 units", region: "Western", date: "Aug 28, 2026", status: "Delivered" },
  { id: "DST-110", program: "Resilient Seeds 2026", items: "Bean seed kits", qty: "900 kits", region: "Eastern", date: "Aug 20, 2026", status: "Delivered" },
];

export const funding = [
  { donor: "Global AgDev Fund", type: "Grant", committed: "$1.2M", received: "$900K", period: "2025–2027", status: "Received" },
  { donor: "GreenFuture Foundation", type: "Grant", committed: "$650K", received: "$650K", period: "2026", status: "Received" },
  { donor: "EU Rural Development", type: "Program funding", committed: "$2.0M", received: "$1.1M", period: "2025–2028", status: "Committed" },
  { donor: "Private donors", type: "Donations", committed: "$180K", received: "$142K", period: "2026", status: "Received" },
];
