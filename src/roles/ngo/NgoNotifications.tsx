import RoleLayout from "../RoleLayout";
import { NotificationsInbox } from "@/components/notifications/NotificationsInbox";
import { NGO_ACCENT, ngoLinks } from "./config";

const NgoNotifications = () => (
  <RoleLayout
    links={ngoLinks}
    roleLabel="NGO / Government"
    accent={NGO_ACCENT}
    title="Notifications"
    subtitle="Program and regional alerts."
  >
    <NotificationsInbox accent={NGO_ACCENT} />
  </RoleLayout>
);

export default NgoNotifications;
