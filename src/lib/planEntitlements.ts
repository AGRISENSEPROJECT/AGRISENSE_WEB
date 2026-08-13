import type {
  AuthUser,
  BillingPlanId,
  PlanLimits,
  UserSubscription,
  UserSubscriptionSummary,
} from "@/api";

export type FarmerFeature =
  | "dashboard"
  | "notifications"
  | "marketplace"
  | "orders"
  | "cropCare"
  | "weather"
  | "community"
  | "messages"
  | "help"
  | "subscription"
  | "settings"
  | "predictionHistory"
  | "analytics"
  | "aiRecommendations"
  | "marketInsights"
  | "unlimitedSoilReports";

export interface PlanEntitlements {
  planId: BillingPlanId | string;
  status: string;
  isPaid: boolean;
  maxFarms: number | null;
  weatherDays: number;
  aiRecommendations: boolean;
  marketInsights: boolean;
  prioritySupport: boolean;
  unlimitedSoilReports: boolean;
  /** Nav / route features allowed for this plan. */
  features: Set<FarmerFeature>;
}

const STARTER_LIMITS: Required<
  Pick<
    PlanLimits,
    | "maxFarms"
    | "weatherDays"
    | "aiRecommendations"
    | "marketInsights"
    | "prioritySupport"
    | "unlimitedSoilReports"
  >
> = {
  maxFarms: 1,
  weatherDays: 3,
  aiRecommendations: false,
  marketInsights: false,
  prioritySupport: false,
  unlimitedSoilReports: false,
};

const PRO_LIMITS = {
  maxFarms: 10 as number | null,
  weatherDays: 7,
  aiRecommendations: true,
  marketInsights: true,
  prioritySupport: false,
  unlimitedSoilReports: true,
};

const ENTERPRISE_LIMITS = {
  maxFarms: null as number | null,
  weatherDays: 14,
  aiRecommendations: true,
  marketInsights: true,
  prioritySupport: true,
  unlimitedSoilReports: true,
};

const ALWAYS_ON: FarmerFeature[] = [
  "dashboard",
  "notifications",
  "marketplace",
  "orders",
  "cropCare",
  "weather",
  "community",
  "messages",
  "help",
  "subscription",
  "settings",
];

function asBool(value: unknown, fallback: boolean): boolean {
  if (typeof value === "boolean") return value;
  return fallback;
}

function asNullableNumber(value: unknown, fallback: number | null): number | null {
  if (value === null) return null;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() && Number.isFinite(Number(value))) {
    return Number(value);
  }
  return fallback;
}

function defaultsForPlan(planId: string) {
  const id = planId.toLowerCase();
  if (id === "enterprise") return ENTERPRISE_LIMITS;
  if (id === "pro") return PRO_LIMITS;
  return STARTER_LIMITS;
}

function pickSubscription(
  user?: AuthUser | null,
  subscription?: UserSubscription | UserSubscriptionSummary | null,
): UserSubscriptionSummary | null {
  return subscription || user?.subscription || null;
}

/** Resolve farmer entitlements from auth profile / billing subscription. */
export function resolvePlanEntitlements(
  user?: AuthUser | null,
  subscription?: UserSubscription | UserSubscriptionSummary | null,
): PlanEntitlements {
  const sub = pickSubscription(user, subscription);
  const planId = String(sub?.planId || "starter").toLowerCase();
  const status = String(sub?.status || "active").toLowerCase();
  const paidActive =
    (planId === "pro" || planId === "enterprise") &&
    ["active", "trialing"].includes(status);

  const effectivePlan = paidActive ? planId : "starter";
  const defaults = defaultsForPlan(effectivePlan);
  const limits = sub?.limits || {};

  const maxFarms = asNullableNumber(limits.maxFarms, defaults.maxFarms);
  const weatherDaysRaw =
    asNullableNumber(limits.weatherDays, defaults.weatherDays) ?? defaults.weatherDays ?? 3;
  const weatherDays = Math.max(1, weatherDaysRaw);
  const aiRecommendations = asBool(limits.aiRecommendations, defaults.aiRecommendations);
  const marketInsights = asBool(limits.marketInsights, defaults.marketInsights);
  const prioritySupport = asBool(limits.prioritySupport, defaults.prioritySupport);
  const unlimitedSoilReports = asBool(
    limits.unlimitedSoilReports,
    defaults.unlimitedSoilReports,
  );

  const features = new Set<FarmerFeature>(ALWAYS_ON);
  if (aiRecommendations) {
    features.add("aiRecommendations");
    features.add("predictionHistory");
  }
  if (marketInsights) features.add("marketInsights");
  if (unlimitedSoilReports) features.add("unlimitedSoilReports");
  // Analytics is a deeper insights surface — Pro / Enterprise only.
  if (aiRecommendations || marketInsights || effectivePlan !== "starter") {
    features.add("analytics");
  }

  return {
    planId: effectivePlan,
    status,
    isPaid: paidActive,
    maxFarms,
    weatherDays,
    aiRecommendations,
    marketInsights,
    prioritySupport,
    unlimitedSoilReports,
    features,
  };
}

export function canAccessFeature(
  entitlements: PlanEntitlements,
  feature: FarmerFeature,
): boolean {
  return entitlements.features.has(feature);
}

export function canAddFarm(entitlements: PlanEntitlements, farmCount: number): boolean {
  if (entitlements.maxFarms == null) return true;
  return farmCount < entitlements.maxFarms;
}

export function planDisplayName(planId?: string | null) {
  const id = String(planId || "starter");
  return id.charAt(0).toUpperCase() + id.slice(1);
}
