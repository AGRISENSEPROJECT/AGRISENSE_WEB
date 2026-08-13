import { Link } from "react-router-dom";
import { Lock, Sparkles } from "lucide-react";
import { routes } from "@/lib/routes";
import { planDisplayName } from "@/lib/planEntitlements";

export function PlanUpgradeBanner({
  title = "Upgrade to unlock this feature",
  description = "Available on Pro and Enterprise plans.",
  compact = false,
}: {
  title?: string;
  description?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border border-amber-200 bg-amber-50 text-amber-950 ${
        compact ? "px-3 py-2" : "px-4 py-3"
      }`}
    >
      <div className={`flex ${compact ? "items-center gap-2" : "flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"}`}>
        <div className="flex items-start gap-2">
          <Lock className={`mt-0.5 shrink-0 text-amber-700 ${compact ? "h-4 w-4" : "h-5 w-5"}`} />
          <div>
            <p className={`font-semibold ${compact ? "text-sm" : "text-sm sm:text-base"}`}>{title}</p>
            {!compact && <p className="mt-0.5 text-sm text-amber-900/80">{description}</p>}
          </div>
        </div>
        <Link
          to={routes.app.subscription}
          state={{ plan: "pro" }}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#2C6E49] px-3 py-2 text-xs font-semibold text-white hover:bg-[#23583a]"
        >
          <Sparkles className="h-3.5 w-3.5" /> Upgrade to Pro
        </Link>
      </div>
    </div>
  );
}

export function PlanFeatureGate({
  title,
  description,
  planId = "starter",
}: {
  title: string;
  description: string;
  planId?: string;
}) {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
        <Lock className="h-7 w-7" />
      </div>
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
        {planDisplayName(planId)} plan
      </p>
      <h1 className="mt-2 text-2xl font-bold text-gray-900">{title}</h1>
      <p className="mt-2 text-sm text-gray-500">{description}</p>
      <Link
        to={routes.app.subscription}
        state={{ plan: "pro" }}
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#2C6E49] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#23583a]"
      >
        <Sparkles className="h-4 w-4" /> View Pro plans
      </Link>
      <Link to={routes.app.root} className="mt-3 text-sm font-medium text-[#2C6E49] hover:underline">
        Back to dashboard
      </Link>
    </div>
  );
}
