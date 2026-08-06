import RoleLayout from "../RoleLayout";
import { NotificationsInbox } from "@/components/notifications/NotificationsInbox";
import { ADMIN_ACCENT, adminLinks } from "./config";

const AdminNotifications = () => (
  <RoleLayout
    links={adminLinks}
    roleLabel="Admin Console"
    accent={ADMIN_ACCENT}
    title="Notifications"
    subtitle="Platform alerts, approvals, and system updates."
  >
    <NotificationsInbox accent={ADMIN_ACCENT} />
  </RoleLayout>
);

export default AdminNotifications;
