import type { ReactNode } from "react";
import { useAuth } from "@/context/useAuth";
import { UserAvatar } from "@/components/UserAvatar";

interface NavbarProps {
  /** Optional left-side control (e.g. mobile menu button). */
  menuButton?: ReactNode;
}

const Navbar = ({ menuButton }: NavbarProps) => {
  const { user } = useAuth();

  const displayName = user?.username || "Guest";
  const displayEmail = user?.email || "";

  return (
    <header className="flex w-full items-center gap-3 border-b bg-white px-3 py-2 shadow-sm sm:gap-4 sm:px-6">
      {menuButton}

      {/* Search — hide on very small screens to free space */}
      <div className="hidden max-w-md flex-1 sm:block">
        <input
          type="search"
          placeholder="Search…"
          className="w-full rounded-md border bg-gray-100 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="ml-auto flex items-center gap-3 sm:gap-5">
        <div className="relative shrink-0">
          <img
            src="/assets/Dashboardicons/notification.svg"
            alt="Notification"
            className="h-5 w-5 sm:h-6 sm:w-6"
          />
          <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-[#377552]" />
        </div>

        <div className="flex items-center gap-2 border-l pl-3 sm:gap-3 sm:pl-4">
          <UserAvatar
            src={user?.profileImage}
            alt={displayName}
            sizeClassName="h-8 w-8 sm:h-10 sm:w-10"
            iconClassName="h-4 w-4 sm:h-5 sm:w-5"
          />
          <div className="hidden min-w-0 sm:block">
            <h2 className="truncate text-sm font-semibold">{displayName}</h2>
            <p className="truncate text-xs text-gray-500">{displayEmail}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
