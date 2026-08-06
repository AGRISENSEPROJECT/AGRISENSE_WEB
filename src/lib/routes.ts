/**
 * Canonical app routes.
 * Keep path strings here so navigations stay consistent across the app.
 */
export const routes = {
  home: "/",
  about: "/about",
  services: "/services",
  blog: "/blog",
  contact: "/contact",

  auth: {
    login: "/auth/login",
    register: "/auth/register",
    verifyOtp: "/auth/verify-otp",
    forgotPassword: "/auth/forgot-password",
    farmerOnboarding: "/auth/farmer-onboarding",
  },

  legal: {
    terms: "/legal/terms",
    privacy: "/legal/privacy",
  },

  app: {
    root: "/app",
    marketplace: "/app/marketplace",
    orders: "/app/orders",
    notifications: "/app/notifications",
    predictionHistory: "/app/predictions",
    cropCare: "/app/crop-care",
    soil: "/app/soil",
    weather: "/app/weather",
    analytics: "/app/analytics",
    community: "/app/community",
    help: "/app/help",
    settings: "/app/settings",
    subscription: "/app/subscription",
  },

  supplier: {
    root: "/supplier",
    products: "/supplier/products",
    orders: "/supplier/orders",
    buyers: "/supplier/buyers",
    analytics: "/supplier/analytics",
    settings: "/supplier/settings",
  },

  admin: {
    root: "/admin",
    users: "/admin/users",
    suppliers: "/admin/suppliers",
    waitlist: "/admin/waitlist",
    moderation: "/admin/moderation",
    analytics: "/admin/analytics",
    settings: "/admin/settings",
  },

  ngo: {
    root: "/ngo",
    programs: "/ngo/programs",
    regions: "/ngo/regions",
    farmers: "/ngo/farmers",
    reports: "/ngo/reports",
    settings: "/ngo/settings",
  },
} as const;

export function getDefaultRouteForRole(role?: string | null): string {
  switch ((role || "").toUpperCase()) {
    case "ADMIN":
      return routes.admin.root;
    case "SUPPLIER":
      return routes.supplier.root;
    case "NGO":
    case "GOVERNMENT":
      return routes.ngo.root;
    case "FARMER":
    default:
      return routes.app.root;
  }
}
