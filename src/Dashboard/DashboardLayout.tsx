import { useState, type ReactNode } from "react";
import { Menu, X } from "lucide-react";
import SideBar from "./SideBar";
import Navbar from "./Navbar";

/**
 * Shared farmer-app shell with a desktop sidebar and a mobile slide-over menu.
 */
const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-dvh overflow-hidden bg-gray-100">
      {/* Desktop sidebar */}
      <div className="hidden shrink-0 md:block">
        <SideBar />
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 flex h-full w-[min(18rem,85vw)] flex-col bg-white shadow-xl">
            <div className="flex items-center justify-end border-b px-3 py-2">
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto">
              <SideBar onNavigate={() => setMobileOpen(false)} compact />
            </div>
          </div>
        </div>
      )}

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Navbar
          menuButton={
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
              className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          }
        />
        <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto bg-white">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
