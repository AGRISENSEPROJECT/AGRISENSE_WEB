import { Link } from "react-router-dom";
import { Sprout, Landmark, HeartHandshake, ArrowRight } from "lucide-react";

const options = [
  {
    to: "/supplier/dashboard",
    icon: Sprout,
    title: "Supplier",
    desc: "Manage products, orders, inventory, and deliveries to buyers.",
  },
  {
    to: "/gov/dashboard",
    icon: Landmark,
    title: "Government",
    desc: "Monitor regional production, subsidies, and the supplier registry.",
  },
  {
    to: "/ngo/dashboard",
    icon: HeartHandshake,
    title: "NGO",
    desc: "Run programs, track beneficiaries, distributions, and funding.",
  },
];

export default function RolePicker() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-canvas px-6">
      <div className="mb-10 flex items-center gap-2">
        <Sprout className="h-9 w-9 text-leaf" strokeWidth={2.5} />
        <span className="text-2xl font-bold tracking-wide">
          <span className="text-leaf">AGRI</span>
          <span className="text-ink">SENSE</span>
        </span>
      </div>

      <h1 className="text-2xl font-bold">Welcome back</h1>
      <p className="mt-2 text-sm text-muted">Choose how you want to sign in today</p>

      <div className="mt-10 grid w-full max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
        {options.map(({ to, icon: Icon, title, desc }) => (
          <Link
            key={to}
            to={to}
            className="card group flex flex-col gap-4 p-6 transition-transform hover:-translate-y-1"
          >
            <span className="w-fit rounded-xl bg-mint-pale p-3">
              <Icon className="h-7 w-7 text-forest" />
            </span>
            <div>
              <h2 className="font-bold">{title}</h2>
              <p className="mt-1 text-xs leading-relaxed text-muted">{desc}</p>
            </div>
            <span className="mt-auto flex items-center gap-1 text-xs font-semibold text-leaf">
              Continue
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
