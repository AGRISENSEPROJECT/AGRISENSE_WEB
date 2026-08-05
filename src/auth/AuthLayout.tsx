import { Link } from "react-router-dom";
import { ArrowLeft, Leaf, ShieldCheck, Sprout, CloudSun } from "lucide-react";
import Logo from "/assets/logo.png";
import { routes } from "@/lib/routes";

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  /** Kept for compatibility; layout no longer flips panels. */
  panel?: "login" | "register" | "center";
}

const FEATURES = [
  { icon: Sprout, text: "Smart soil analysis & crop recommendations" },
  { icon: CloudSun, text: "Real-time weather insights for your farms" },
  { icon: Leaf, text: "Grow a thriving farming community" },
  { icon: ShieldCheck, text: "Bank-grade security for your data" },
];

const AuthLayout = ({ title, subtitle, children, footer }: AuthLayoutProps) => {
  return (
    <div className="flex min-h-screen w-full bg-[#F0F5F2]">
      {/* Branding panel */}
      <aside className="relative hidden overflow-hidden bg-gradient-to-br from-[#0B6E4F] via-[#2C6E49] to-[#14532d] text-white lg:flex lg:w-1/2">
        <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -right-16 bottom-0 h-96 w-96 rounded-full bg-emerald-300/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/3 h-40 w-40 rounded-full bg-lime-300/10 blur-2xl" />

        <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">
          <Link
            to={routes.home}
            className="flex w-fit items-center gap-3 transition-opacity hover:opacity-90"
          >
            <img src={Logo} alt="AgriSense" className="h-11 w-11 object-contain drop-shadow" />
            <span className="text-2xl font-extrabold tracking-tight">
              AGRI<span className="text-lime-300">SENSE</span>
            </span>
          </Link>

          <div className="max-w-md space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-extrabold leading-tight xl:text-5xl">
                Farm smarter, <br /> grow better.
              </h2>
              <p className="text-lg leading-relaxed text-white/80">
                AgriSense brings AI-powered soil detection, weather intelligence
                and a farming community together in one place.
              </p>
            </div>

            <ul className="space-y-4">
              {FEATURES.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
                    <Icon className="h-5 w-5 text-lime-200" />
                  </span>
                  <span className="text-white/90">{text}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-sm text-white/60">
            &copy; {new Date().getFullYear()} AgriSense. All rights reserved.
          </p>
        </div>
      </aside>

      {/* Form panel */}
      <main className="flex flex-1 items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <Link
            to={routes.home}
            className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-[#2C6E49]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>

          <Link
            to={routes.home}
            className="mb-8 flex items-center justify-center gap-2 lg:hidden"
          >
            <img src={Logo} alt="AgriSense" className="h-10 w-10 object-contain" />
            <span className="text-2xl font-extrabold tracking-tight text-gray-900">
              AGRI<span className="text-[#2C6E49]">SENSE</span>
            </span>
          </Link>

          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-[0_10px_40px_rgba(11,110,79,0.12)] sm:p-10">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              {subtitle ? <p className="mt-1.5 text-sm text-gray-500">{subtitle}</p> : null}
            </div>
            {children}
          </div>

          {footer ? <div className="mt-6 text-center">{footer}</div> : null}
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;
