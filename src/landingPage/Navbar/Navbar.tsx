import { useState } from "react";
import Logo from "/assets/logo.png";
import { Button } from "@/components/ui/button";
import ToggleMenuIcon from "./Hambagur";
import { Link, NavLink } from "react-router-dom";
import { useGetStarted } from "@/hooks/useGetStarted";
import { routes } from "@/lib/routes";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { to: ctaTo, label: ctaLabel, isAuthenticated } = useGetStarted();

  const navItems = [
    { title: "Home", to: routes.home },
    { title: "About us", to: routes.about },
    { title: "Services", to: routes.services },
    { title: "Blogs", to: routes.blog },
    { title: "Contact", to: routes.contact },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/85 backdrop-blur-md supports-[backdrop-filter]:bg-white/70">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10">
        <Link to={routes.home} className="flex shrink-0 items-center" onClick={() => setMenuOpen(false)}>
          <img className="h-12 w-auto sm:h-16" src={Logo || "/placeholder.svg"} alt="AgriSense" />
        </Link>

        {/* Desktop Links */}
        <div className="hidden items-center gap-1 md:flex lg:gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.title}
              to={item.to}
              end={item.to === routes.home}
              className={({ isActive }) =>
                `group relative rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive ? "text-[#2C6E49]" : "text-gray-600 hover:text-[#2C6E49]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {item.title}
                  <span
                    className={`pointer-events-none absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-[#2C6E49] transition-transform duration-300 ${
                      isActive ? "scale-x-100" : "origin-left scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden items-center gap-2 md:flex">
          {!isAuthenticated && (
            <Link
              to={routes.auth.login}
              className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold text-gray-600 transition-colors hover:text-[#2C6E49]"
            >
              Sign in
            </Link>
          )}
          <Link to={ctaTo}>
            <Button className="whitespace-nowrap rounded-lg bg-[#2C6E49] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#23583a] hover:shadow-md">
              {ctaLabel}
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden">
          <button type="button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            <ToggleMenuIcon isOpen={menuOpen} />
          </button>
        </div>
      </nav>

      {/* Mobile Links Dropdown */}
      {menuOpen && (
        <div className="absolute left-0 right-0 top-full flex flex-col gap-1 border-t border-gray-100 bg-white px-4 py-3 shadow-lg md:hidden">
          {navItems.map((item) => (
            <NavLink
              key={item.title}
              to={item.to}
              end={item.to === routes.home}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-green-50 text-[#2C6E49]"
                    : "text-gray-700 hover:bg-gray-50 hover:text-[#2C6E49]"
                }`
              }
            >
              {item.title}
            </NavLink>
          ))}
          <div className="mt-2 flex flex-col gap-2 border-t border-gray-100 pt-3">
            {!isAuthenticated && (
              <Link
                to={routes.auth.login}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 hover:text-[#2C6E49]"
              >
                Sign in
              </Link>
            )}
            <Link to={ctaTo} className="w-full" onClick={() => setMenuOpen(false)}>
              <Button className="w-full rounded-lg bg-[#2C6E49] py-2.5 text-sm font-semibold text-white hover:bg-[#23583a]">
                {ctaLabel}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
