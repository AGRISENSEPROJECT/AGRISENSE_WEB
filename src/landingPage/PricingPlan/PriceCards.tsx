import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Check, Sparkles } from "lucide-react";
import { useAuth } from "@/context/useAuth";
import { routes } from "@/lib/routes";
import { billingService, type BillingPlan, type BillingPlanId } from "@/api";

type Billing = "monthly" | "annual";

interface Plan {
  id: BillingPlanId;
  title: string;
  description: string;
  monthly: number | null;
  annualPerMonth: number | null;
  features: string[];
  popular?: boolean;
}

const FALLBACK_PLANS: Plan[] = [
  {
    id: "starter",
    title: "Starter",
    description: "For smallholder farmers getting started with smart farming.",
    monthly: 0,
    annualPerMonth: 0,
    features: [
      "1 farm profile",
      "Basic soil & crop analysis",
      "3-day weather forecast",
      "Community access",
    ],
  },
  {
    id: "pro",
    title: "Pro",
    description: "For active farmers who want the full picture, all season.",
    monthly: 10000,
    annualPerMonth: 8000,
    features: [
      "Up to 10 farm profiles",
      "Unlimited soil & crop reports",
      "7-day weather & pest alerts",
      "Personalised AI recommendations",
      "Supplier & market insights",
      "Priority support",
    ],
    popular: true,
  },
  {
    id: "enterprise",
    title: "Enterprise",
    description: "For cooperatives, suppliers, NGOs & government programs.",
    monthly: null,
    annualPerMonth: null,
    features: [
      "Unlimited farms & team members",
      "Regional & nationwide data",
      "Program & impact dashboards",
      "API access & integrations",
      "Dedicated account manager",
    ],
  },
];

function mapApiPlan(p: BillingPlan): Plan {
  const fallback = FALLBACK_PLANS.find((f) => f.id === p.id);
  const monthly =
    p.priceMonthly !== undefined ? p.priceMonthly : p.monthly !== undefined ? p.monthly : fallback?.monthly ?? null;
  const annualPerMonth =
    p.priceAnnualPerMonth !== undefined
      ? p.priceAnnualPerMonth
      : p.annualPerMonth !== undefined
        ? p.annualPerMonth
        : fallback?.annualPerMonth ?? null;

  return {
    id: (p.id as BillingPlanId) || "starter",
    title: p.title || p.name || fallback?.title || String(p.id),
    description: p.description || fallback?.description || "",
    monthly,
    annualPerMonth,
    features: p.features?.length ? p.features : fallback?.features || [],
    popular: p.popular ?? p.id === "pro",
  };
}

const PriceCards = () => {
  const [billing, setBilling] = useState<Billing>("monthly");
  const [plans, setPlans] = useState<Plan[]>(FALLBACK_PLANS);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    let active = true;
    billingService
      .getPlans()
      .then((rows) => {
        if (!active || !rows.length) return;
        setPlans(rows.map(mapApiPlan));
      })
      .catch(() => {
        // Keep marketing fallbacks if catalog is unreachable.
      });
    return () => {
      active = false;
    };
  }, []);

  const resolveCta = (plan: Plan) => {
    if (plan.id === "enterprise") {
      return {
        label: "Contact Sales",
        to: routes.contact,
        state: { plan: "enterprise", subject: "Enterprise enquiry" },
      };
    }
    if (plan.id === "pro") {
      return {
        label: isAuthenticated ? "Subscribe to Pro" : "Start Free Trial",
        to: isAuthenticated ? routes.app.subscription : routes.auth.login,
        state: {
          plan: "pro",
          billing,
          from: { pathname: routes.app.subscription },
        },
      };
    }
    return {
      label: isAuthenticated ? "Manage subscription" : "Get Started Free",
      to: isAuthenticated ? routes.app.subscription : routes.auth.register,
      state: {
        plan: "starter",
        from: { pathname: routes.app.subscription },
      },
    };
  };

  const formatPrice = (plan: Plan) => {
    if (plan.monthly === null) return "Custom";
    const value = billing === "monthly" ? plan.monthly : plan.annualPerMonth!;
    return value === 0 ? "Free" : `RWF ${value.toLocaleString()}`;
  };

  return (
    <div>
      <div className="mb-10 flex items-center justify-center gap-3">
        <span
          className={`text-sm font-semibold ${
            billing === "monthly" ? "text-gray-900" : "text-gray-400"
          }`}
        >
          Monthly
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={billing === "annual"}
          onClick={() => setBilling((b) => (b === "monthly" ? "annual" : "monthly"))}
          className="relative h-7 w-14 rounded-full bg-[#2C6E49] transition-colors"
        >
          <span
            className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${
              billing === "annual" ? "left-8" : "left-1"
            }`}
          />
        </button>
        <span
          className={`text-sm font-semibold ${
            billing === "annual" ? "text-gray-900" : "text-gray-400"
          }`}
        >
          Annual
        </span>
        <span className="rounded-full bg-lime-100 px-2.5 py-0.5 text-xs font-semibold text-[#2C6E49]">
          Save 20%
        </span>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => {
          const cta = resolveCta(plan);
          return (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-2xl border bg-white p-8 text-left transition-all ${
                plan.popular
                  ? "border-[#2C6E49] shadow-2xl lg:-translate-y-2"
                  : "border-gray-200 shadow-sm hover:shadow-lg"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full bg-[#2C6E49] px-3 py-1 text-xs font-semibold text-white shadow">
                  <Sparkles className="h-3.5 w-3.5" /> Most Popular
                </span>
              )}

              <h3 className="text-lg font-bold text-gray-900">{plan.title}</h3>
              <p className="mt-1.5 min-h-[40px] text-sm text-gray-500">{plan.description}</p>

              <div className="mt-5 flex items-end gap-1">
                <span className="text-4xl font-extrabold text-gray-900">{formatPrice(plan)}</span>
                {plan.monthly !== null && plan.monthly > 0 && (
                  <span className="mb-1 text-sm font-medium text-gray-400">/mo</span>
                )}
              </div>
              {plan.monthly !== null && plan.monthly > 0 && billing === "annual" && (
                <p className="mt-1 text-xs text-gray-400">
                  Billed annually (RWF {(plan.annualPerMonth! * 12).toLocaleString()}/yr)
                </p>
              )}
              {plan.monthly === 0 && <p className="mt-1 text-xs text-gray-400">Forever free</p>}
              {plan.monthly === null && (
                <p className="mt-1 text-xs text-gray-400">Tailored to your organization</p>
              )}

              <Link
                to={cta.to}
                state={cta.state}
                className={`mt-6 inline-flex w-full items-center justify-center rounded-lg px-4 py-2.5 font-semibold transition-colors ${
                  plan.popular
                    ? "bg-[#2C6E49] text-white hover:bg-[#23583a]"
                    : "border border-[#2C6E49] text-[#2C6E49] hover:bg-[#2C6E49]/5"
                }`}
              >
                {cta.label}
              </Link>

              <div className="mt-8 border-t pt-6">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  What&apos;s included
                </p>
                <ul className="space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-gray-600">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#2C6E49]" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-8 text-center text-sm text-gray-500">
        No credit card required to start · Cancel anytime · Prices in RWF
      </p>
    </div>
  );
};

export default PriceCards;
