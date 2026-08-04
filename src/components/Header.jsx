import { Search, Bell, ChevronDown } from "lucide-react";
import { useLocation } from "react-router-dom";
import { roleFromPath } from "../data/roles.js";

export default function Header() {
  const { pathname } = useLocation();
  const { user } = roleFromPath(pathname);

  return (
    <header className="flex items-center justify-between gap-4 border-b border-gray-100 bg-white px-6 py-4 lg:px-8">
      <div className="flex max-w-md flex-1 items-center gap-3 rounded-full border border-gray-200 bg-gray-50 px-4 py-2.5">
        <Search className="h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
        />
      </div>

      <div className="flex items-center gap-5">
        <button className="relative rounded-full border border-gray-200 p-2.5 hover:bg-gray-50">
          <Bell className="h-5 w-5 text-gray-600" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-leaf" />
        </button>

        <button className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-forest text-sm font-semibold text-white">
            {user.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div className="hidden text-left sm:block">
            <p className="text-sm font-semibold leading-tight">{user.name}</p>
            <p className="text-xs text-muted">{user.email}</p>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </button>
      </div>
    </header>
  );
}
