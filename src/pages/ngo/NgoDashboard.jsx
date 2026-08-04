import DashboardTemplate from "../../components/DashboardTemplate.jsx";
import { ngoKpis, programMix, beneficiariesReached, distributionActivity } from "../../data/ngoData.js";

export default function NgoDashboard() {
  return (
    <DashboardTemplate
      subtitle="Welcome back to your program impact overview"
      chipText="34°C – Sunny with clear skies"
      ctaText="View programs"
      kpis={ngoKpis}
      pie={{ title: "Program Focus Mix", data: programMix }}
      line={{
        title: "Beneficiaries Reached Monitoring",
        data: beneficiariesReached,
        series: [
          { key: "reached", label: "Reached", color: "#4c9a6b" },
          { key: "planned", label: "Planned", color: "#1f2937" },
        ],
      }}
      activity={{
        title: "Distribution Activity",
        data: distributionActivity,
        areaKey: "planned",
        areaLabel: "Planned",
        lineKey: "completed",
        lineLabel: "Completed",
      }}
    />
  );
}
