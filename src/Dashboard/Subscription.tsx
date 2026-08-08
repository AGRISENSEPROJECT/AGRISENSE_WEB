import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
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
import {
  ApiError,
  billingService,
  type BillingCycle,
  type BillingPlan,
  type BillingPlanId,
  type CheckoutResponse,
  type UserSubscription,
} from "@/api";
import { useAuth } from "@/context/useAuth";

type PayMethod = "momo" | "airtel" | "card";

const CHECKOUT_KEY = "agrisense.pending_checkout";

const FALLBACK_PLANS: Array<{
  id: BillingPlanId;
  title: string;
  monthly: number | null;
  annualPerMonth: number | null;
  description: string;
  features: string[];
  popular?: boolean;
}> = [
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

function formatRwf(n: number) {
  return `RWF ${n.toLocaleString()}`;
}

function planTitle(plan: BillingPlan) {
  return plan.title || plan.name || String(plan.id);
}

function planMonthly(plan: BillingPlan): number | null {
  if (plan.priceMonthly !== undefined) return plan.priceMonthly;
  if (plan.monthly !== undefined) return plan.monthly;
  return null;
}

function planAnnualPerMonth(plan: BillingPlan): number | null {
  if (plan.priceAnnualPerMonth !== undefined) return plan.priceAnnualPerMonth;
  if (plan.annualPerMonth !== undefined) return plan.annualPerMonth;
  return null;
}

function unwrapSub(payload: unknown): UserSubscription | null {
  if (!payload || typeof payload !== "object") return null;
  const record = payload as Record<string, unknown>;
  const nested = record.subscription;
  if (nested && typeof nested === "object") {
    return nested as UserSubscription;
  }
  if ("planId" in record) {
    return record as unknown as UserSubscription;
  }
  return null;
}

function statusBadgeClass(status?: string) {
  const s = (status || "").toLowerCase();
  if (s === "active" || s === "trialing") return "bg-emerald-50 text-emerald-700";
  if (s === "pending_payment") return "bg-amber-50 text-amber-800";
  if (s === "past_due" || s === "expired" || s === "canceled") {
    return "bg-red-50 text-red-700";
  }
  return "bg-gray-100 text-gray-600";
}

const Subscription = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { refreshProfile } = useAuth();
  const incoming = (location.state as { plan?: BillingPlanId; billing?: BillingCycle } | null) ?? {};

  const [plans, setPlans] = useState<BillingPlan[]>([]);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<BillingPlanId>(incoming.plan ?? "pro");
  const [billing, setBilling] = useState<BillingCycle>(incoming.billing ?? "monthly");
  const [method, setMethod] = useState<PayMethod>("momo");
  const [phone, setPhone] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [polling, setPolling] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Enterprise inquiry fields
  const [orgName, setOrgName] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [enterpriseMessage, setEnterpriseMessage] = useState("");

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    setPolling(false);
  }, []);

  const applySubscription = useCallback(
    async (next: UserSubscription | null) => {
      if (next) setSubscription(next);
      try {
        await refreshProfile();
      } catch {
        // Profile refresh is best-effort after billing changes.
      }
    },
    [refreshProfile],
  );

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [planRes, subRes] = await Promise.all([
        billingService.getPlans().catch(() => [] as BillingPlan[]),
        billingService.getSubscription(),
      ]);
      setPlans(planRes.length ? planRes : FALLBACK_PLANS.map((p) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        features: p.features,
        priceMonthly: p.monthly,
        priceAnnualPerMonth: p.annualPerMonth,
        popular: p.popular,
      })));
      setSubscription(subRes);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load billing.");
      setPlans(
        FALLBACK_PLANS.map((p) => ({
          id: p.id,
          title: p.title,
          description: p.description,
          features: p.features,
          priceMonthly: p.monthly,
          priceAnnualPerMonth: p.annualPerMonth,
          popular: p.popular,
        })),
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = "Billing & Subscription | AGRISENSE";
    reload();
    return () => stopPolling();
  }, [reload, stopPolling]);

  useEffect(() => {
    if (incoming.plan) setPlan(incoming.plan);
    if (incoming.billing) setBilling(incoming.billing);
  }, [incoming.plan, incoming.billing]);

  const handleCheckoutResult = useCallback(
    async (result: CheckoutResponse) => {
      const status = String(result.status || result.subscription?.status || "").toLowerCase();
      if (status === "active" || status === "successful" || status === "success") {
        sessionStorage.removeItem(CHECKOUT_KEY);
        stopPolling();
        const sub = result.subscription || (await billingService.getSubscription());
        await applySubscription(sub);
        setInfo("Payment confirmed. Your Pro plan is now active.");
        setError(null);
        return true;
      }
      if (status === "failed" || status === "canceled" || status === "expired") {
        sessionStorage.removeItem(CHECKOUT_KEY);
        stopPolling();
        setError("Payment did not complete. Your previous plan is unchanged.");
        await reload();
        return true;
      }
      return false;
    },
    [applySubscription, reload, stopPolling],
  );

  const startPolling = useCallback(
    (checkoutId: string) => {
      stopPolling();
      setPolling(true);
      sessionStorage.setItem(CHECKOUT_KEY, checkoutId);
      pollRef.current = setInterval(async () => {
        try {
          const result = await billingService.getCheckout(checkoutId);
          await handleCheckoutResult(result);
        } catch {
          // Keep polling through transient errors.
        }
      }, 2500);
    },
    [handleCheckoutResult, stopPolling],
  );

  // Resume polling after redirect back from Flutterwave card checkout.
  useEffect(() => {
    const paid = searchParams.get("paid");
    const canceled = searchParams.get("canceled");
    const pendingId = sessionStorage.getItem(CHECKOUT_KEY);

    if (canceled === "1") {
      sessionStorage.removeItem(CHECKOUT_KEY);
      setError("Checkout was canceled. No charge was made.");
      setSearchParams({}, { replace: true });
      return;
    }

    if ((paid === "1" || pendingId) && pendingId) {
      setInfo("Checking payment status…");
      startPolling(pendingId);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams, startPolling]);

  const displayPlans = useMemo(() => {
    if (!plans.length) return FALLBACK_PLANS;
    return plans.map((p) => {
      const fallback = FALLBACK_PLANS.find((f) => f.id === p.id);
      return {
        id: (p.id as BillingPlanId) || "starter",
        title: planTitle(p),
        description: p.description || fallback?.description || "",
        monthly: planMonthly(p),
        annualPerMonth: planAnnualPerMonth(p),
        features: p.features?.length ? p.features : fallback?.features || [],
        popular: p.popular ?? p.id === "pro",
      };
    });
  }, [plans]);

  const selected = displayPlans.find((p) => p.id === plan) || displayPlans[0];

  const price = useMemo(() => {
    if (selected.monthly === null) return null;
    if (selected.monthly === 0) return 0;
    return billing === "monthly" ? selected.monthly : (selected.annualPerMonth ?? 0) * 12;
  }, [selected, billing]);

  const perMonth = useMemo(() => {
    if (selected.monthly === null || selected.monthly === 0) return selected.monthly;
    return billing === "monthly" ? selected.monthly : selected.annualPerMonth;
  }, [selected, billing]);

  const needsPayment = plan === "pro";
  const isProActive =
    (subscription?.planId || "").toLowerCase() === "pro" &&
    ["active", "trialing"].includes(String(subscription?.status || "").toLowerCase());

  const validatePayment = () => {
    if (!needsPayment) return true;
    if (method === "momo" || method === "airtel") {
      const digits = phone.replace(/\D/g, "");
      if (digits.length < 9) {
        setError("Enter a valid mobile money number (e.g. 078… or +250 78…).");
        return false;
      }
      return true;
    }
    // Card: Flutterwave hosts card entry on redirect; we only need optional prefill validation
    // if the user typed something. Card fields are optional before redirect.
    if (cardNumber.trim()) {
      const digits = cardNumber.replace(/\s/g, "");
      if (!isValidCardNumber(digits)) {
        setError("Enter a valid 16-digit card number, or leave blank and pay on Flutterwave.");
        return false;
      }
      if (cardExpiry.trim() && !isValidCardExpiry(cardExpiry.trim())) {
        setError("Enter a valid expiry date (MM/YY).");
        return false;
      }
      if (cardCvc.trim() && !/^\d{3,4}$/.test(cardCvc.trim())) {
        setError("Enter a valid CVC.");
        return false;
      }
    }
    return true;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);

    if (plan === "enterprise") {
      if (!orgName.trim() || !contactName.trim() || !contactEmail.trim() || !enterpriseMessage.trim()) {
        setError("Fill in organization name, contact name, email, and message for Enterprise.");
        return;
      }
      setSaving(true);
      try {
        await billingService.enterpriseInquiry({
          organizationName: orgName.trim(),
          contactName: contactName.trim(),
          contactEmail: contactEmail.trim(),
          contactPhone: contactPhone.trim() || undefined,
          message: enterpriseMessage.trim(),
        });
        setInfo("Enterprise inquiry sent. Our team will follow up by email.");
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Failed to send Enterprise inquiry.");
      } finally {
        setSaving(false);
      }
      return;
    }

    if (plan === "starter") {
      setSaving(true);
      try {
        const res = await billingService.activateStarter();
        await applySubscription(unwrapSub(res) || (await billingService.getSubscription()));
        setInfo("You are on the Starter plan.");
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Failed to activate Starter.");
      } finally {
        setSaving(false);
      }
      return;
    }

    // Pro checkout
    if (!validatePayment()) return;
    setSaving(true);
    try {
      const origin = window.location.origin;
      const result = await billingService.checkout({
        planId: "pro",
        billingCycle: billing,
        method,
        phone: method === "card" ? undefined : phone.trim() || undefined,
        returnUrl: `${origin}${routes.app.subscription}?paid=1`,
        cancelUrl: `${origin}${routes.app.subscription}?canceled=1`,
      });

      if (result.subscription) {
        setSubscription(result.subscription);
      }

      const redirect = result.payment?.redirectUrl;
      if (redirect) {
        sessionStorage.setItem(CHECKOUT_KEY, result.checkoutId);
        window.location.href = redirect;
        return;
      }

      setInfo(
        result.payment?.message ||
          "Approve the payment prompt on your phone. We will activate Pro when payment succeeds.",
      );
      startPolling(result.checkoutId);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Checkout failed. Please try again.");
    } finally {
      setSaving(false);
      setCardNumber("");
      setCardCvc("");
    }
  };

  const cancelSubscription = async (atPeriodEnd: boolean) => {
    setSaving(true);
    setError(null);
    setInfo(null);
    try {
      const res = await billingService.cancel({ atPeriodEnd });
      await applySubscription(unwrapSub(res) || (await billingService.getSubscription()));
      setInfo(
        atPeriodEnd
          ? "Cancellation scheduled. Pro stays active until the end of the billing period."
          : "Subscription canceled. You are back on Starter.",
      );
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to cancel subscription.");
    } finally {
      setSaving(false);
    }
  };

  const resumeSubscription = async () => {
    setSaving(true);
    setError(null);
    setInfo(null);
    try {
      const res = await billingService.resume();
      await applySubscription(unwrapSub(res) || (await billingService.getSubscription()));
      setInfo("Subscription resumed. Auto-renew is on again.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to resume subscription.");
    } finally {
      setSaving(false);
    }
  };

  const ctaLabel =
    plan === "starter"
      ? "Confirm Starter plan"
      : plan === "enterprise"
        ? "Send Enterprise inquiry"
        : billing === "annual"
          ? `Pay ${formatRwf(price ?? 0)} / year`
          : `Subscribe · ${formatRwf(perMonth ?? 0)}/mo`;

  const paymentLabel =
    subscription?.paymentLabel ||
    subscription?.label ||
    (subscription?.paymentMethod && subscription.paymentMethod !== "none"
      ? String(subscription.paymentMethod)
      : null);

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-5xl space-y-6 p-4 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your AgriSense plan and Flutterwave payments (MoMo, Airtel, card).
            </p>
          </div>
          <Link
            to={routes.app.settings}
            className="text-sm font-medium text-[#2C6E49] hover:underline"
          >
            Account settings
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-[#2C6E49]" />
          </div>
        ) : (
          <>
            <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Current plan
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-bold text-gray-900 capitalize">
                      {subscription?.planId || "starter"}
                    </h2>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusBadgeClass(
                        subscription?.status,
                      )}`}
                    >
                      {(subscription?.status || "active").replace(/_/g, " ")}
                    </span>
                    {polling && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Waiting for payment…
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    {paymentLabel ? `${paymentLabel} · ` : ""}
                    {subscription?.billingCycle ? `${subscription.billingCycle} billing` : "Free plan"}
                    {subscription?.currentPeriodEnd
                      ? ` · renews/ends ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}`
                      : ""}
                    {subscription?.cancelAtPeriodEnd ? " · cancels at period end" : ""}
                  </p>
                  {subscription?.limits?.maxFarms != null && (
                    <p className="mt-1 text-xs text-gray-400">
                      Farm limit: {subscription.limits.maxFarms === null ? "Unlimited" : subscription.limits.maxFarms}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {isProActive && !subscription?.cancelAtPeriodEnd && (
                    <>
                      <button
                        type="button"
                        disabled={saving}
                        onClick={() => cancelSubscription(true)}
                        className="rounded-md border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-60"
                      >
                        Cancel at period end
                      </button>
                      <button
                        type="button"
                        disabled={saving}
                        onClick={() => cancelSubscription(false)}
                        className="rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
                      >
                        Cancel now
                      </button>
                    </>
                  )}
                  {isProActive && subscription?.cancelAtPeriodEnd && (
                    <button
                      type="button"
                      disabled={saving}
                      onClick={resumeSubscription}
                      className="rounded-md border border-[#2C6E49]/30 bg-[#2C6E49]/5 px-3 py-2 text-sm font-medium text-[#2C6E49] disabled:opacity-60"
                    >
                      Resume Pro
                    </button>
                  )}
                </div>
              </div>
            </section>

            <form onSubmit={onSubmit} noValidate className="grid gap-6 lg:grid-cols-[1fr_320px]">
              <div className="space-y-6">
                <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-sm font-semibold text-gray-900">Billing cycle</h3>
                    <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-1">
                      {(["monthly", "annual"] as BillingCycle[]).map((b) => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => setBilling(b)}
                          className={`rounded-md px-3 py-1.5 text-xs font-semibold capitalize ${
                            billing === b
                              ? "bg-white text-gray-900 shadow-sm"
                              : "text-gray-500 hover:text-gray-700"
                          }`}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>
                </section>

                <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <h3 className="text-sm font-semibold text-gray-900">Choose a plan</h3>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    {displayPlans.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setPlan(p.id);
                          setError(null);
                          setInfo(null);
                        }}
                        className={`rounded-xl border p-4 text-left transition-colors ${
                          plan === p.id
                            ? "border-[#2C6E49] bg-[#2C6E49]/[0.04] ring-1 ring-[#2C6E49]/30"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-gray-900">{p.title}</span>
                          {p.popular && (
                            <span className="rounded-full bg-[#2C6E49]/10 px-2 py-0.5 text-[10px] font-bold uppercase text-[#2C6E49]">
                              Popular
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-gray-500">{p.description}</p>
                        <p className="mt-3 text-sm font-bold text-gray-900">
                          {p.monthly === null
                            ? "Custom"
                            : p.monthly === 0
                              ? "Free"
                              : `${formatRwf(
                                  billing === "monthly" ? p.monthly : p.annualPerMonth ?? p.monthly,
                                )}/mo`}
                        </p>
                        <ul className="mt-3 space-y-1.5">
                          {p.features.slice(0, 3).map((f) => (
                            <li key={f} className="flex items-start gap-1.5 text-xs text-gray-600">
                              <Check className="mt-0.5 h-3 w-3 shrink-0 text-[#2C6E49]" />
                              {f}
                            </li>
                          ))}
                        </ul>
                      </button>
                    ))}
                  </div>
                </section>

                {needsPayment && (
                  <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-sm font-semibold text-gray-900">Payment method</h3>
                      <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                        <Lock className="h-3.5 w-3.5" />
                        Flutterwave
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
                            <span className="mt-0.5 block text-xs text-gray-500">{opt.hint}</span>
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
                        <p className="text-sm text-gray-600">
                          You will be redirected to Flutterwave’s secure card page to complete payment.
                          Optional details below are not sent to our servers as card data.
                        </p>
                      )}

                      {method === "card" && (
                        <>
                          <label className="block">
                            <span className="mb-1.5 block text-xs font-medium text-gray-600">
                              Name on card (optional)
                            </span>
                            <input
                              type="text"
                              value={cardName}
                              onChange={(e) => setCardName(e.target.value)}
                              className={PAYMENT_INPUT_CLASS}
                            />
                          </label>
                          <label className="block">
                            <span className="mb-1.5 block text-xs font-medium text-gray-600">
                              Card number (optional preview)
                            </span>
                            <input
                              type="text"
                              inputMode="numeric"
                              value={cardNumber}
                              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                              placeholder="Leave blank — enter on Flutterwave"
                              maxLength={19}
                              className={`${PAYMENT_INPUT_CLASS} font-mono tracking-wider`}
                            />
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
                                placeholder="MM/YY"
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
                                maxLength={4}
                                className={`${PAYMENT_INPUT_CLASS} font-mono`}
                              />
                            </label>
                          </div>
                        </>
                      )}
                    </div>
                  </section>
                )}

                {plan === "enterprise" && (
                  <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-3">
                    <h3 className="text-sm font-semibold text-gray-900">Enterprise inquiry</h3>
                    <p className="text-sm text-gray-500">
                      Tell us about your organization. We email sales — no card required.
                    </p>
                    <input
                      className={PAYMENT_INPUT_CLASS}
                      placeholder="Organization name *"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                    />
                    <div className="grid gap-3 sm:grid-cols-2">
                      <input
                        className={PAYMENT_INPUT_CLASS}
                        placeholder="Contact name *"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                      />
                      <input
                        className={PAYMENT_INPUT_CLASS}
                        type="email"
                        placeholder="Contact email *"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                      />
                    </div>
                    <input
                      className={PAYMENT_INPUT_CLASS}
                      placeholder="Phone (optional)"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                    />
                    <textarea
                      className={`${PAYMENT_INPUT_CLASS} min-h-[100px]`}
                      placeholder="What do you need? *"
                      value={enterpriseMessage}
                      onChange={(e) => setEnterpriseMessage(e.target.value)}
                    />
                    <button
                      type="button"
                      className="text-sm text-[#2C6E49] hover:underline"
                      onClick={() =>
                        navigate(routes.contact, {
                          state: { plan: "enterprise", subject: "Enterprise subscription" },
                        })
                      }
                    >
                      Or open the public contact page
                    </button>
                  </section>
                )}

                {error && (
                  <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {error}
                  </p>
                )}
                {info && (
                  <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                    {info}
                  </p>
                )}
              </div>

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
                      <dt className="text-gray-500">Subtotal</dt>
                      <dd className="font-medium text-gray-900">
                        {price === null ? "Quote" : price === 0 ? "Free" : formatRwf(price)}
                      </dd>
                    </div>
                    <div className="border-t border-gray-100 pt-3">
                      <div className="flex justify-between gap-3">
                        <dt className="font-semibold text-gray-900">Due today</dt>
                        <dd className="text-lg font-bold text-gray-900">
                          {price === null ? "—" : price === 0 ? formatRwf(0) : formatRwf(price)}
                        </dd>
                      </div>
                    </div>
                  </dl>

                  <button
                    type="submit"
                    disabled={saving || polling}
                    className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#2C6E49] text-sm font-semibold text-white hover:bg-[#245a3c] disabled:opacity-60"
                  >
                    {(saving || polling) && <Loader2 className="h-4 w-4 animate-spin" />}
                    {ctaLabel}
                  </button>

                  <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-gray-400">
                    <Shield className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    Pro activates only after Flutterwave confirms payment. Failed payments keep your
                    current plan.
                  </p>
                </div>
              </aside>
            </form>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Subscription;
