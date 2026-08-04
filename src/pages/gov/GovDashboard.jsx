import DashboardTemplate from "../../components/DashboardTemplate.jsx";
import { govKpis, regionalProduction, nationalProduction, subsidyActivity } from "../../data/govData.js";

export default function GovDashboard() {
  return (
    <DashboardTemplate
      subtitle="Welcome back to the national agriculture overview"
      chipText="34°C – Sunny with clear skies"
      ctaText="View reports"
      kpis={govKpis}
      pie={{ title: "Regional Production Share", data: regionalProduction }}
      line={{
        title: "National Production Monitoring (kt)",
        data: nationalProduction,
        series: [
          { key: "maize", label: "Maize", color: "#4c9a6b" },
          { key: "rice", label: "Rice", color: "#1f2937" },
        ],
      }}
      activity={{
        title: "Subsidy Activity (B RWF)",
        data: subsidyActivity,
        areaKey: "requested",
        areaLabel: "Requested",
        lineKey: "disbursed",
        lineLabel: "Disbursed",
      }}
    />
  );
}
