import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Check,
  CreditCard,
  Loader2,
  Lock,
  Shield,
  Smartphone,
} from "lucide-react";
import DashboardLayout from "./DashboardLayout";
import { routes } from "@/lib/routes";
import {
  formatCardExpiry,
  formatCardNumber,
  isValidCardExpiry,
  isValidCardNumber,
  PAYMENT_INPUT_CLASS,
} from "@/lib/cardInput";

type PlanId = "starter" | "pro" | "enterprise";
type Billing = "monthly" | "annual";
type PayMethod = "momo" | "airtel" | "card";

interface PlanOption {
  id: PlanId;
  title: string;
  monthly: number | null;
  annualPerMonth: number | null;
  description: string;
  features: string[];
  popular?: boolean;
}

const PLANS: PlanOption[] = [
  {
    id: "starter",
    title: "Starter",
    monthly: 0,
    annualPerMonth: 0,
    description: "Essentials for one farm.",
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
    monthly: 10000,
    annualPerMonth: 8000,
    description: "Full tools for active farmers.",
    features: [
      "Up to 10 farm profiles",
      "Unlimited soil & crop reports",
      "7-day weather & pest alerts",
      "AI recommendations",
      "Supplier & market insights",
      "Priority support",
    ],
    popular: true,
  },
  {
    id: "enterprise",
    title: "Enterprise",
    monthly: null,
    annualPerMonth: null,
    description: "For co-ops, NGOs and programs.",
    features: [
      "Unlimited farms & seats",
      "Regional dashboards",
      "API access",
      "Dedicated account manager",
    ],
  },
];

const STORAGE_KEY = "agrisense.subscription";

interface SavedSubscription {
  plan: PlanId;
  billing: Billing;
  method: PayMethod;
  label: string;
  status: "active" | "trialing" | "pending";
  updatedAt: string;
}

function loadSaved(): SavedSubscription | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SavedSubscription;
  } catch {
    return null;
  }
}

function saveSub(data: SavedSubscription) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function formatRwf(n: number) {
  return `RWF ${n.toLocaleString()}`;
}

const Subscription = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const incoming = (location.state as { plan?: PlanId; billing?: Billing } | null) ?? {};

  const existing = loadSaved();
  const [plan, setPlan] = useState<PlanId>(incoming.plan ?? existing?.plan ?? "pro");
  const [billing, setBilling] = useState<Billing>(
    incoming.billing ?? existing?.billing ?? "monthly",
  );
  const [method, setMethod] = useState<PayMethod>(existing?.method ?? "momo");
  const [phone, setPhone] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<SavedSubscription | null>(existing);
  const [done, setDone] = useState(false);

  useEffect(() => {
    document.title = "Billing & Subscription | AGRISENSE";
  }, []);

  useEffect(() => {
    if (incoming.plan) setPlan(incoming.plan);
    if (incoming.billing) setBilling(incoming.billing);
  }, [incoming.plan, incoming.billing]);

  const selected = PLANS.find((p) => p.id === plan)!;

  const price = useMemo(() => {
    if (selected.monthly === null) return null;
    if (selected.monthly === 0) return 0;
    return billing === "monthly" ? selected.monthly : selected.annualPerMonth! * 12;
  }, [selected, billing]);

  const perMonth = useMemo(() => {
    if (selected.monthly === null || selected.monthly === 0) return selected.monthly;
    return billing === "monthly" ? selected.monthly : selected.annualPerMonth!;
  }, [selected, billing]);

  const needsPayment = plan === "pro";

  const validate = () => {
    if (!needsPayment) return true;
    if (method === "momo" || method === "airtel") {
      const digits = phone.replace(/\D/g, "");
      if (digits.length < 9) {
        setError("Enter a valid mobile money number (e.g. 078… or +250 78…).");
        return false;
      }
      return true;
    }
    const digits = cardNumber.replace(/\s/g, "");
    if (!isValidCardNumber(digits)) {
      setError("Enter a valid 16-digit card number.");
      return false;
    }
    if (!isValidCardExpiry(cardExpiry.trim())) {
      setError("Enter a valid expiry date (MM/YY, not in the past).");
      return false;
    }
    if (!/^\d{3,4}$/.test(cardCvc.trim())) {
      setError("Enter a valid CVC.");
      return false;
    }
    if (!cardName.trim()) {
      setError("Enter the name on the card.");
      return false;
    }
    return true;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setDone(false);
    if (!validate()) return;

    if (plan === "enterprise") {
      navigate(routes.contact, {
        state: { plan: "enterprise", subject: "Enterprise subscription" },
      });
      return;
    }

    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));

    const label =
      plan === "starter"
        ? "No payment required"
        : method === "card"
          ? `Visa/Mastercard ···· ${cardNumber.replace(/\s/g, "").slice(-4)}`
          : `${method === "momo" ? "MTN MoMo" : "Airtel Money"} · ${phone.trim()}`;

    const next: SavedSubscription = {
      plan,
      billing,
      method: plan === "starter" ? "momo" : method,
      label,
      status: plan === "starter" ? "active" : "active",
      updatedAt: new Date().toISOString(),
    };
    saveSub(next);
    setSaved(next);
    setSaving(false);
    setDone(true);
    // Do not keep full card details in memory after save.
    setCardNumber("");
    setCardCvc("");
    setCardExpiry("");
    setCardName("");
  };

  const downgradeToFree = () => {
    const next: SavedSubscription = {
      plan: "starter",
      billing: "monthly",
      method: "momo",
      label: "No payment required",
      status: "active",
      updatedAt: new Date().toISOString(),
    };
    saveSub(next);
    setSaved(next);
    setPlan("starter");
    setDone(true);
    setError(null);
  };

  const ctaLabel =
    plan === "starter"
      ? "Confirm Starter plan"
      : plan === "enterprise"
        ? "Contact sales"
        : billing === "annual"
          ? `Pay ${formatRwf(price ?? 0)} / year`
          : `Subscribe · ${formatRwf(perMonth ?? 0)}/mo`;

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-5xl space-y-6 p-4 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your AgriSense plan and payment method.
            </p>
          </div>
          <Link
            to={routes.app.settings}
            className="text-sm font-medium text-[#2C6E49] hover:underline"
          >
            Account settings
          </Link>
        </div>

        {/* Current plan */}
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Current plan
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold text-gray-900">
                  {saved
                    ? saved.plan.charAt(0).toUpperCase() + saved.plan.slice(1)
                    : "Starter"}
                </h2>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    (saved?.status ?? "active") === "active"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {saved?.status ?? "active"}
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                {saved
                  ? `${saved.label} · ${saved.billing} billing · updated ${new Date(
                      saved.updatedAt,
                    ).toLocaleDateString()}`
                  : "You are on the free Starter plan. Upgrade anytime."}
              </p>
            </div>
            {saved && saved.plan !== "starter" && (
              <button
                type="button"
                onClick={downgradeToFree}
                className="rounded-md border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Cancel &amp; go free
              </button>
            )}
          </div>
        </section>

        <form onSubmit={onSubmit} noValidate className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            {/* Billing cycle */}
            <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-sm font-semibold text-gray-900">Billing cycle</h3>
                <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-1">
                  {(["monthly", "annual"] as Billing[]).map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setBilling(b)}
                      className={`rounded-md px-3.5 py-1.5 text-sm font-medium capitalize transition ${
                        billing === b
                          ? "bg-white text-gray-900 shadow-sm"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {b}
                      {b === "annual" && (
                        <span className="ml-1.5 text-xs font-semibold text-[#2C6E49]">
                          -20%
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Plans */}
            <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900">Choose a plan</h3>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {PLANS.map((p) => {
                  const amount =
                    p.monthly === null
                      ? "Custom"
                      : p.monthly === 0
                        ? "Free"
                        : formatRwf(
                            billing === "monthly" ? p.monthly : p.annualPerMonth!,
                          );
                  const active = plan === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPlan(p.id)}
                      className={`relative flex flex-col rounded-xl border p-4 text-left transition ${
                        active
                          ? "border-[#2C6E49] bg-[#2C6E49]/[0.04] ring-2 ring-[#2C6E49]"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {p.popular && (
                        <span className="absolute -top-2.5 left-3 rounded bg-[#2C6E49] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                          Popular
                        </span>
                      )}
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-gray-900">{p.title}</span>
                        {active && (
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#2C6E49] text-white">
                            <Check className="h-3 w-3" />
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-2xl font-bold text-gray-900">
                        {amount}
                        {p.monthly !== null && p.monthly > 0 && (
                          <span className="text-sm font-normal text-gray-400">/mo</span>
                        )}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">{p.description}</p>
                      <ul className="mt-3 space-y-1.5 border-t border-gray-100 pt-3">
                        {p.features.slice(0, 4).map((f) => (
                          <li key={f} className="flex gap-2 text-xs text-gray-600">
                            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#2C6E49]" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Payment method */}
            {needsPayment && (
              <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-gray-900">Payment method</h3>
                  <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                    <Lock className="h-3.5 w-3.5" />
                    Encrypted fields
                  </span>
                </div>

                <div className="mt-4 grid gap-2 sm:grid-cols-3">
                  {(
                    [
                      { id: "momo" as const, label: "MTN MoMo", hint: "Mobile money" },
                      { id: "airtel" as const, label: "Airtel Money", hint: "Mobile money" },
                      { id: "card" as const, label: "Card", hint: "Visa / Mastercard" },
                    ] as const
                  ).map((opt) => (
                    <label
                      key={opt.id}
                      className={`flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-3 ${
                        method === opt.id
                          ? "border-[#2C6E49] bg-[#2C6E49]/[0.04]"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="pay-method"
                        className="mt-1 accent-[#2C6E49]"
                        checked={method === opt.id}
                        onChange={() => setMethod(opt.id)}
                      />
                      <span>
                        <span className="flex items-center gap-1.5 text-sm font-semibold text-gray-900">
                          {opt.id === "card" ? (
                            <CreditCard className="h-4 w-4 text-gray-500" />
                          ) : (
                            <Smartphone className="h-4 w-4 text-gray-500" />
                          )}
                          {opt.label}
                        </span>
                        <span className="mt-0.5 block text-xs text-gray-500">
                          {opt.hint}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>

                <div className="mt-4 space-y-3 rounded-lg border border-gray-100 bg-gray-50 p-4">
                  {(method === "momo" || method === "airtel") && (
                    <label className="block">
                      <span className="mb-1.5 block text-xs font-medium text-gray-600">
                        Phone number
                      </span>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+250 788 123 456"
                        autoComplete="tel"
                        inputMode="tel"
                        className={PAYMENT_INPUT_CLASS}
                      />
                      <span className="mt-1 block text-xs text-gray-400">
                        You will receive a payment prompt on this number.
                      </span>
                    </label>
                  )}

                  {method === "card" && (
                    <>
                      <label className="block">
                        <span className="mb-1.5 block text-xs font-medium text-gray-600">
                          Cardholder name
                        </span>
                        <input
                          type="text"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          placeholder="Full name on card"
                          autoComplete="cc-name"
                          spellCheck={false}
                          className={PAYMENT_INPUT_CLASS}
                        />
                      </label>
                      <label className="block">
                        <span className="mb-1.5 block text-xs font-medium text-gray-600">
                          Card number
                        </span>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                          placeholder="1234 5678 9012 3456"
                          autoComplete="off"
                          name="card-number-display"
                          spellCheck={false}
                          maxLength={19}
                          aria-label="Card number"
                          className={`${PAYMENT_INPUT_CLASS} font-mono tracking-wider`}
                        />
                        <span className="mt-1 block text-xs text-gray-400">
                          16 digits · spaces added automatically
                        </span>
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <label className="block">
                          <span className="mb-1.5 block text-xs font-medium text-gray-600">
                            Expiry
                          </span>
                          <input
                            type="text"
                            inputMode="numeric"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(formatCardExpiry(e.target.value))}
                            placeholder="MM / YY"
                            autoComplete="cc-exp"
                            spellCheck={false}
                            maxLength={5}
                            className={`${PAYMENT_INPUT_CLASS} font-mono`}
                          />
                        </label>
                        <label className="block">
                          <span className="mb-1.5 block text-xs font-medium text-gray-600">
                            CVC
                          </span>
                          <input
                            type="password"
                            inputMode="numeric"
                            value={cardCvc}
                            onChange={(e) =>
                              setCardCvc(e.target.value.replace(/\D/g, "").slice(0, 4))
                            }
                            placeholder="•••"
                            autoComplete="off"
                            name="card-cvc"
                            spellCheck={false}
                            maxLength={4}
                            aria-label="Card security code"
                            className={`${PAYMENT_INPUT_CLASS} font-mono tracking-widest`}
                          />
                        </label>
                      </div>
                    </>
                  )}
                </div>
              </section>
            )}

            {plan === "enterprise" && (
              <section className="rounded-xl border border-gray-200 bg-white p-5 text-sm text-gray-600 shadow-sm">
                Enterprise pricing is tailored to your organization. Continue to contact sales
                with your requirements — no card needed here.
              </section>
            )}

            {error && (
              <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            )}
            {done && (
              <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                {plan === "starter"
                  ? "You are on the Starter plan."
                  : "Subscription updated. Your plan is now active."}
              </p>
            )}
          </div>

          {/* Order summary */}
          <aside className="h-fit lg:sticky lg:top-6">
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900">Order summary</h3>

              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-gray-500">Plan</dt>
                  <dd className="font-medium text-gray-900">{selected.title}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-gray-500">Billing</dt>
                  <dd className="font-medium capitalize text-gray-900">
                    {plan === "enterprise" ? "Custom" : billing}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-gray-500">
                    {billing === "annual" && needsPayment ? "Billed annually" : "Subtotal"}
                  </dt>
                  <dd className="font-medium text-gray-900">
                    {price === null
                      ? "Quote"
                      : price === 0
                        ? "Free"
                        : formatRwf(price)}
                  </dd>
                </div>
                {needsPayment && billing === "annual" && (
                  <div className="flex justify-between gap-3 text-xs text-[#2C6E49]">
                    <dt>You save vs monthly</dt>
                    <dd className="font-semibold">
                      {formatRwf((selected.monthly! - selected.annualPerMonth!) * 12)}
                    </dd>
                  </div>
                )}
                <div className="border-t border-gray-100 pt-3">
                  <div className="flex justify-between gap-3">
                    <dt className="font-semibold text-gray-900">Due today</dt>
                    <dd className="text-lg font-bold text-gray-900">
                      {price === null
                        ? "—"
                        : price === 0
                          ? formatRwf(0)
                          : formatRwf(price)}
                    </dd>
                  </div>
                  {needsPayment && perMonth !== null && (
                    <p className="mt-1 text-xs text-gray-400">
                      Then {formatRwf(perMonth)}/mo
                      {billing === "annual" ? " equivalent" : ""} · cancel anytime
                    </p>
                  )}
                </div>
              </dl>

              <button
                type="submit"
                disabled={saving}
                className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#2C6E49] text-sm font-semibold text-white hover:bg-[#245a3c] disabled:opacity-60"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                {ctaLabel}
              </button>

              <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-gray-400">
                <Shield className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                Payment details stay on your device for now. Live MoMo and card charging will
                connect when the payment gateway is enabled.
              </p>
            </div>
          </aside>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default Subscription;
