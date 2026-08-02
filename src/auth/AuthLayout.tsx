import { Leaf, ShieldCheck, Sprout, CloudSun } from "lucide-react";
import Logo from "/assets/logo.png";

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  /** Small footer node rendered under the form card (e.g. links). */
  footer?: React.ReactNode;
}

const FEATURES = [
  { icon: Sprout, text: "Smart soil analysis & crop recommendations" },
  { icon: CloudSun, text: "Real-time weather insights for your farms" },
  { icon: Leaf, text: "Grow a thriving farming community" },
  { icon: ShieldCheck, text: "Bank-grade security for your data" },
];

const AuthLayout = ({ title, subtitle, children, footer }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen w-full flex bg-[#F0F5F2]">
      {/* Branding panel */}
      <aside className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#0B6E4F] via-[#2C6E49] to-[#14532d] text-white">
        {/* Decorative blobs */}
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute bottom-0 -right-16 h-96 w-96 rounded-full bg-emerald-300/10 blur-3xl" />
        <div className="absolute top-1/3 left-1/2 h-40 w-40 rounded-full bg-lime-300/10 blur-2xl" />

        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          <div className="flex items-center gap-3">
            <img src={Logo} alt="AgriSense" className="h-11 w-11 object-contain drop-shadow" />
            <span className="text-2xl font-extrabold tracking-tight">
              AGRI<span className="text-lime-300">SENSE</span>
            </span>
          </div>

          <div className="space-y-8 max-w-md">
            <div className="space-y-4">
              <h2 className="text-4xl xl:text-5xl font-extrabold leading-tight">
                Farm smarter, <br /> grow better.
              </h2>
              <p className="text-white/80 text-lg leading-relaxed">
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

          <p className="text-white/60 text-sm">
            &copy; {new Date().getFullYear()} AgriSense. All rights reserved.
          </p>
        </div>
      </aside>

      {/* Form panel */}
      <main className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center justify-center gap-2 mb-8 lg:hidden">
            <img src={Logo} alt="AgriSense" className="h-10 w-10 object-contain" />
            <span className="text-2xl font-extrabold tracking-tight text-gray-900">
              AGRI<span className="text-[#2C6E49]">SENSE</span>
            </span>
          </div>

          <div className="bg-white rounded-2xl shadow-[0_10px_40px_rgba(11,110,79,0.12)] border border-gray-100 p-8 sm:p-10">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              {subtitle && <p className="text-gray-500 text-sm mt-1.5">{subtitle}</p>}
            </div>
            {children}
          </div>

          {footer && <div className="mt-6 text-center">{footer}</div>}
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;
