import { Users, BarChart3, Settings as SettingsIcon } from "lucide-react";
import RoleLayout from "../RoleLayout";
import { PagePlaceholder } from "../ui";
import { SUPPLIER_ACCENT, supplierLinks } from "./config";

export const SupplierBuyers = () => (
  <RoleLayout links={supplierLinks} roleLabel="Supplier Portal" accent={SUPPLIER_ACCENT} title="Buyers">
    <PagePlaceholder
      icon={Users}
      accent={SUPPLIER_ACCENT}
      title="Buyer relationships"
      description="View buyer profiles, order history and messaging. This will populate from the Supplier API."
    />
  </RoleLayout>
);

export const SupplierAnalytics = () => (
  <RoleLayout links={supplierLinks} roleLabel="Supplier Portal" accent={SUPPLIER_ACCENT} title="Analytics">
    <PagePlaceholder
      icon={BarChart3}
      accent={SUPPLIER_ACCENT}
      title="Sales analytics"
      description="Deeper revenue, conversion and demand insights will render here once wired to the API."
    />
  </RoleLayout>
);

export const SupplierSettings = () => (
  <RoleLayout links={supplierLinks} roleLabel="Supplier Portal" accent={SUPPLIER_ACCENT} title="Settings">
    <PagePlaceholder
      icon={SettingsIcon}
      accent={SUPPLIER_ACCENT}
      title="Store settings"
      description="Business profile, payout details and notification preferences go here."
    />
  </RoleLayout>
);
