import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import Logo from "/assets/logo.png";
import { Button } from "@/components/ui/button";
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

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[70] focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:text-[#2C6E49]"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/85 backdrop-blur-md supports-[backdrop-filter]:bg-white/70">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10">
          <Link to={routes.home} className="flex shrink-0 items-center" onClick={closeMenu}>
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

          {/* Mobile menu toggle — hidden while drawer is open (drawer has its own close) */}
          {!menuOpen && (
            <div className="md:hidden">
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
                aria-expanded={false}
                className="rounded-lg p-2 text-gray-700 hover:bg-gray-100"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          )}
        </nav>
      </header>

      {/* Mobile side drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-black/40"
            onClick={closeMenu}
          />

          <aside
            className={[
              "absolute left-0 top-0 flex h-full w-[min(18rem,85vw)] flex-col bg-white shadow-xl",
              "animate-in slide-in-from-left duration-300",
            ].join(" ")}
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
              <Link to={routes.home} className="flex items-center gap-2" onClick={closeMenu}>
                <img className="h-10 w-auto" src={Logo || "/placeholder.svg"} alt="AgriSense" />
                <span className="text-sm font-bold text-gray-900">
                  AGRI<span className="text-[#2C6E49]">SENSE</span>
                </span>
              </Link>
              <button
                type="button"
                aria-label="Close menu"
                onClick={closeMenu}
                className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex min-h-0 flex-1 flex-col overflow-y-auto px-3 py-4">
              <div className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.title}
                    to={item.to}
                    end={item.to === routes.home}
                    onClick={closeMenu}
                    className={({ isActive }) =>
                      `rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-green-50 text-[#2C6E49]"
                          : "text-gray-700 hover:bg-gray-50 hover:text-[#2C6E49]"
                      }`
                    }
                  >
                    {item.title}
                  </NavLink>
                ))}
              </div>

              <div className="mt-auto flex flex-col gap-2 border-t border-gray-100 pt-4">
                {!isAuthenticated && (
                  <Link
                    to={routes.auth.login}
                    onClick={closeMenu}
                    className="rounded-lg px-3 py-3 text-center text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 hover:text-[#2C6E49]"
                  >
                    Sign in
                  </Link>
                )}
                <Link to={ctaTo} className="w-full" onClick={closeMenu}>
                  <Button className="w-full rounded-lg bg-[#2C6E49] py-2.5 text-sm font-semibold text-white hover:bg-[#23583a]">
                    {ctaLabel}
                  </Button>
                </Link>
              </div>
            </nav>
          </aside>
        </div>
      )}
    </>
  );
};

export default Navbar;
