import { useState } from "react";
import Logo from "/assets/logo.png";
import { Button } from "@/components/ui/button";
import ToggleMenuIcon from "./Hambagur";
import { Link } from "react-router-dom";
import { useGetStarted } from "@/hooks/useGetStarted";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { to: ctaTo, label: ctaLabel, isAuthenticated } = useGetStarted();

  const navItems = [
    { title: "Home", href: "#home" },
    { title: "About us", href: "#about" },
    { title: "Services", href: "#services" },
    { title: "Blogs", href: "#blogs" },
    { title: "Contact", href: "#contact" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/85 backdrop-blur-md supports-[backdrop-filter]:bg-white/70">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10">
        {/* Logo — enlarged but overflows the slim bar so header height stays compact */}
        <a href="#home" className="flex items-center shrink-0">
          <img className="h-16 sm:h-20 w-auto -my-3" src={Logo || "/placeholder.svg"} alt="AgriSense" />
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1 lg:gap-2">
          {navItems.map((item) => (
            <a
              key={item.title}
              href={item.href}
              className="group relative rounded-md px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:text-[#2C6E49]"
            >
              {item.title}
              <span className="pointer-events-none absolute inset-x-3 -bottom-0.5 h-0.5 origin-left scale-x-0 rounded-full bg-[#2C6E49] transition-transform duration-300 group-hover:scale-x-100" />
            </a>
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden md:flex items-center gap-2">
          {!isAuthenticated && (
            <Link
              to="/auth/login"
              className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-600 transition-colors hover:text-[#2C6E49] whitespace-nowrap"
            >
              Sign in
            </Link>
          )}
          <Link to={ctaTo}>
            <Button className="rounded-lg bg-[#2C6E49] px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#23583a] hover:shadow-md whitespace-nowrap">
              {ctaLabel}
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <ToggleMenuIcon isOpen={menuOpen} />
          </button>
        </div>
      </nav>

      {/* Mobile Links Dropdown */}
      {menuOpen && (
        <div className="absolute top-full left-0 right-0 flex flex-col gap-1 border-t border-gray-100 bg-white px-4 py-3 shadow-lg md:hidden">
          {navItems.map((item) => (
            <a
              key={item.title}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-[#2C6E49]"
            >
              {item.title}
            </a>
          ))}
          <div className="mt-2 flex flex-col gap-2 border-t border-gray-100 pt-3">
            {!isAuthenticated && (
              <Link
                to="/auth/login"
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
