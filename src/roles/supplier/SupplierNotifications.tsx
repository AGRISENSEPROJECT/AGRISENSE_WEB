import RoleLayout from "../RoleLayout";
import { NotificationsInbox } from "@/components/notifications/NotificationsInbox";
import { SUPPLIER_ACCENT, supplierLinks } from "./config";

const SupplierNotifications = () => (
  <RoleLayout
    links={supplierLinks}
    roleLabel="Supplier Portal"
    accent={SUPPLIER_ACCENT}
    title="Notifications"
    subtitle="Order updates and marketplace alerts."
  >
    <NotificationsInbox accent={SUPPLIER_ACCENT} />
  </RoleLayout>
);

export default SupplierNotifications;
