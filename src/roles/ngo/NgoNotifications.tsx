import RoleLayout from "../RoleLayout";
import { NotificationsInbox } from "@/components/notifications/NotificationsInbox";
import { NGO_ACCENT, ngoLinks } from "./config";
import { useOrgPortal } from "./useOrgPortal";

const NgoNotifications = () => {
  const portal = useOrgPortal();
  return (
    <RoleLayout
      links={ngoLinks}
      roleLabel={portal.roleLabel}
      accent={NGO_ACCENT}
      title="Notifications"
      subtitle="Program invitations, advisories, and regional alerts."
    >
      <NotificationsInbox accent={NGO_ACCENT} />
    </RoleLayout>
  );
};

export default NgoNotifications;
