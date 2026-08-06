import DashboardLayout from "./DashboardLayout";
import { NotificationsInbox } from "@/components/notifications/NotificationsInbox";

export default function Notifications() {
  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl space-y-2 p-4 sm:p-6">
        <h1 className="text-2xl font-bold text-[#0B6E4F]">Notifications</h1>
        <NotificationsInbox accent="#2C6E49" />
      </div>
    </DashboardLayout>
  );
}
