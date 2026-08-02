import { Users, FileBarChart, Settings as SettingsIcon } from "lucide-react";
import RoleLayout from "../RoleLayout";
import { PagePlaceholder } from "../ui";
import { NGO_ACCENT, ngoLinks } from "./config";

export const NgoFarmers = () => (
  <RoleLayout links={ngoLinks} roleLabel="NGO / Government" accent={NGO_ACCENT} title="Farmers">
    <PagePlaceholder
      icon={Users}
      accent={NGO_ACCENT}
      title="Farmer registry"
      description="Beneficiary farmer profiles and enrolment data will appear here once the API is connected."
    />
  </RoleLayout>
);

export const NgoReports = () => (
  <RoleLayout links={ngoLinks} roleLabel="NGO / Government" accent={NGO_ACCENT} title="Reports">
    <PagePlaceholder
      icon={FileBarChart}
      accent={NGO_ACCENT}
      title="Impact reports"
      description="Generate and export program impact and funding reports here."
    />
  </RoleLayout>
);

export const NgoSettings = () => (
  <RoleLayout links={ngoLinks} roleLabel="NGO / Government" accent={NGO_ACCENT} title="Settings">
    <PagePlaceholder
      icon={SettingsIcon}
      accent={NGO_ACCENT}
      title="Organization settings"
      description="Organization profile, team members and access controls will live here."
    />
  </RoleLayout>
);
