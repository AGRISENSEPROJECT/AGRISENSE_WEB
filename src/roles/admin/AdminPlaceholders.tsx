import { Store, BarChart3, Settings as SettingsIcon } from "lucide-react";
import RoleLayout from "../RoleLayout";
import { PagePlaceholder } from "../ui";
import { ADMIN_ACCENT, adminLinks } from "./config";

export const AdminSuppliers = () => (
  <RoleLayout links={adminLinks} roleLabel="Admin Console" accent={ADMIN_ACCENT} title="Suppliers">
    <PagePlaceholder
      icon={Store}
      accent={ADMIN_ACCENT}
      title="Supplier approvals"
      description="Approve, verify and manage supplier accounts here once the Admin API is connected."
    />
  </RoleLayout>
);

export const AdminAnalytics = () => (
  <RoleLayout links={adminLinks} roleLabel="Admin Console" accent={ADMIN_ACCENT} title="Analytics">
    <PagePlaceholder
      icon={BarChart3}
      accent={ADMIN_ACCENT}
      title="Platform analytics"
      description="Engagement, retention and regional adoption metrics will render here."
    />
  </RoleLayout>
);

export const AdminSettings = () => (
  <RoleLayout links={adminLinks} roleLabel="Admin Console" accent={ADMIN_ACCENT} title="Settings">
    <PagePlaceholder
      icon={SettingsIcon}
      accent={ADMIN_ACCENT}
      title="Platform settings"
      description="Roles, permissions and system configuration will live here."
    />
  </RoleLayout>
);
